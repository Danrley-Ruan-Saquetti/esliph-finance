import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { PayloadJWTUser } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'

const schemaDTO = ValidatorService.schema.object({
    email: ValidatorService.schema.string().email({ message: GLOBAL_USER_DTO.email.messageInvalid }).trim().min(1, { message: GLOBAL_USER_DTO.email.messageRequired }),
    password: ValidatorService.schema.string().trim().min(1, { message: GLOBAL_USER_DTO.password.messageRequired }),
})

export type AuthSignInDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.user.use-case.sign-in' })
export class AuthUserSignInUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('jwt') private jwt: JWTService,
    ) {
        super()
    }

    async perform(args: AuthSignInDTOArgs) {
        const { email, password } = this.validateDTO(args, schemaDTO)

        const user = await this.queryUserByEmail(email)
        await this.validPassword(password, user.password)
        const token = this.generateToken({ sub: user.id, email: user.email, name: user.name })

        return Result.success({ token })
    }

    private async queryUserByEmail(email: string) {
        const userResult = await this.userRepository.findByEmail(email)

        if (userResult.isSuccess()) {
            return userResult.getValue()
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({ title: 'Sign-in User', message: 'Unable to valid e-mail or password. Please, try again later' })
        }

        throw new BadRequestException({ title: 'Sign-in User', message: 'E-mail or password invalid' })
    }

    private async validPassword(password: string, passwordHash: string) {
        const isSamePassword = await this.crypto.bcrypto.compare(password, passwordHash)

        if (!isSamePassword) {
            throw new BadRequestException({ title: 'Sign-in User', message: 'E-mail or password invalid' })
        }
    }

    private generateToken({ sub, email, name }: PayloadJWTUser) {
        return this.jwt.encode<PayloadJWTUser>({ sub, name, email }, { exp: GLOBAL_SERVER_JWT_TOKEN.expiresTime, secret: GLOBAL_SERVER_JWT_TOKEN.keyMaster })
    }
}
