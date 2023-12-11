import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { JWT_EXPIRES_TIME, SERVER_KEY_SECRET_MASTER } from '@global'
import { PayloadJWTUser } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'

const schemaDTO = ValidatorService.schema.object({
    email: ValidatorService.schema.string().email({ message: 'E-mail invalid' }).trim().min(1, { message: 'E-mail is required' }),
    password: ValidatorService.schema.string().trim().min(1, { message: 'Password is required' }),
})

export type AuthSignInDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.use-case.sign-in' })
export class AuthSignInUseCase extends UseCase {
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

        if (!userResult.isSuccess()) {
            throw new BadRequestException({ title: 'Sign-in', message: 'E-mail or password invalid' })
        }

        return userResult.getValue()
    }

    private async validPassword(password: string, passwordHash: string) {
        const isSamePassword = await this.crypto.bcrypto.compare(password, passwordHash)

        if (!isSamePassword) {
            throw new BadRequestException({ title: 'Sign-in', message: 'E-mail or password invalid' })
        }
    }

    private generateToken({ sub, email, name }: PayloadJWTUser) {
        return this.jwt.encode<PayloadJWTUser>({ sub, name, email }, { exp: JWT_EXPIRES_TIME, secret: SERVER_KEY_SECRET_MASTER })
    }
}
