import { Result, Injection, Service } from '@core'
import { PayloadJWTAdmin } from '@@types'
import { GLOBAL_APP, GLOBAL_FORMATTER_CONFIG, GLOBAL_MAIL_CONFIG, GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { AdminSignInTemplate } from '@templates/admin-account-sing-in'
import { SchemaValidator } from '@services/validator.service'
import { GLOBAL_AUTH_CLIENT_DTO } from '@modules/auth/admin/auth-admin.global'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserModel } from '@modules/user/user.model'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'

const schemaDTO = SchemaValidator.object({
    login: SchemaValidator
        .string({ 'required_error': GLOBAL_AUTH_CLIENT_DTO.login.messageRequired })
        .trim(),
    password: SchemaValidator
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
})

export type AuthSignInDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.admin.use-case.sign-in' })
export class AuthAdminSignInUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('jwt') private jwt: JWTService,
        @Injection.Inject('mail.use-case.create') private mailCreateUC: MailCreateUseCase,
    ) {
        super()
    }

    async perform(args: AuthSignInDTOArgs) {
        const { login, password } = this.validateDTO(args, schemaDTO)

        const user = await this.queryUserByLogin(login)
        await this.validPassword(password, user.password)
        const token = this.generateToken({ sub: user.id, email: user.login, name: user.people.name, peopleId: user.peopleId })
        await this.createMail(user)

        return Result.success({ token })
    }

    private async queryUserByLogin(login: string) {
        const userResult = await this.userRepository.findFirst({
            where: { login, type: UserModel.Type.ADMIN },
            include: { people: true }
        })

        if (!userResult.isSuccess()) {
            if (userResult.isErrorInOperation()) {
                throw new BadRequestException({ ...userResult.getError(), title: 'Sign-in User' })
            }
            throw new BadRequestException({ title: 'Sign-in User', message: 'E-mail or password invalid. Please, try again later' })
        }

        if (!userResult.getValue().people.active || !userResult.getValue().active) {
            throw new BadRequestException({ title: 'Sign-in User', message: 'You cannot log in to this account because your username has been inactivated' })
        }

        return userResult.getValue()
    }


    private async validPassword(password: string, passwordHash: string) {
        const isSamePassword = await this.crypto.bcrypto.compare(password, passwordHash)

        if (!isSamePassword) {
            throw new BadRequestException({ title: 'Sign-in User', message: 'E-mail or password invalid. Please, try again later' })
        }
    }

    private generateToken({ sub, email, name, peopleId }: PayloadJWTAdmin) {
        return this.jwt.encode<PayloadJWTAdmin>({ sub, name, email, peopleId }, { exp: GLOBAL_SERVER_JWT_TOKEN.authenticationExpiresTime, secret: GLOBAL_SERVER_JWT_TOKEN.keyMaster })
    }

    private async createMail({ people, login }: UserModel.UserWithPeople) {
        const now = this.dateService.now()

        const contentResult = AdminSignInTemplate({ name: people.name, dateTime: GLOBAL_FORMATTER_CONFIG.date.format(now) })

        if (!contentResult.isSuccess()) {
            throw new BadRequestException({ title: 'Create E-mail', message: 'Unable to create a e-mail' })
        }

        const result = await this.mailCreateUC.perform({
            sender: `${GLOBAL_APP.name} <${GLOBAL_MAIL_CONFIG.domain}>`,
            recipient: login,
            subject: 'New login in your account',
            content: contentResult.getValue(),
        })

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }
    }
}
