import { Result, Injection, Service } from '@core'
import { PayloadJWTCustomer } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_AUTH_CLIENT_DTO } from '@modules/auth/customer/auth-customer.global'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserModel } from '@modules/user/user.model'

const schemaDTO = ValidatorService.schema.object({
    login: ValidatorService.schema
        .string({ 'required_error': GLOBAL_AUTH_CLIENT_DTO.login.messageRequired })
        .trim(),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
})

export type AuthSignInDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.customer.use-case.sign-in' })
export class AuthCustomerSignInUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('jwt') private jwt: JWTService,
    ) {
        super()
    }

    async perform(args: AuthSignInDTOArgs) {
        const { login, password } = this.validateDTO(args, schemaDTO)

        const user = await this.queryUserByLogin(login)
        await this.validPassword(password, user.password)
        const token = this.generateToken({ sub: user.id, email: user.login, name: user.people.name, peopleId: user.peopleId })

        return Result.success({ token })
    }

    private async queryUserByLogin(login: string) {
        const userResult = await this.userRepository.findFirst({
            where: { login, type: UserModel.Type.CUSTOMER },
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

    private generateToken({ sub, email, name, peopleId }: PayloadJWTCustomer) {
        return this.jwt.encode<PayloadJWTCustomer>({ sub, name, email, peopleId }, { exp: GLOBAL_SERVER_JWT_TOKEN.authenticationExpiresTime, secret: GLOBAL_SERVER_JWT_TOKEN.keyCustomer })
    }
}
