import { Injection, Result, Service } from '@core'
import { ID, PayloadJWTCustomerResetPassword } from '@@types'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator } from '@services/validator.service'
import { CryptoService } from '@services/crypto.service'
import { UseCase } from '@common/use-case'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { BadRequestException } from '@common/exceptions/bad-request.exception'
import { UserModel } from '@modules/user/user.model'
import { CustomerRepository } from '@modules/user/customer/customer.repository'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { GLOBAL_AUTH_CLIENT_DTO } from '@modules/auth/customer/auth-customer.global'

const schemaDTO = SchemaValidator.object({
    password: SchemaValidator
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex }),
    token: SchemaValidator
        .string({ 'required_error': GLOBAL_AUTH_CLIENT_DTO.token.messageRequired })

})

export type AuthCustomerResetPasswordDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.customer.use-case.reset-password' })
export class AuthCustomerResetPasswordUseCase extends UseCase {
    constructor(
        @Injection.Inject('jwt') private jwt: JWTService,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('customer.repository') private customerRepository: CustomerRepository,
        @Injection.Inject('mail.use-case.create') private mailCreate: MailCreateUseCase,
    ) {
        super()
    }

    async perform(data: AuthCustomerResetPasswordDTOArgs) {
        const { password, token } = this.validateDTO(data, schemaDTO)

        const { email, sub: userId } = this.jwt.decode<PayloadJWTCustomerResetPassword>(token, GLOBAL_SERVER_JWT_TOKEN.keyResetPassword)
        await this.queryCustomerByEmailAndId(email, userId)
        const passwordHashed = this.cryptPassword(password)
        await this.updatePasswordById(passwordHashed, userId)

        return Result.success({ message: 'Password reset successfully' })
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async queryCustomerByEmailAndId(email: string, id: ID) {
        const customerResult = await this.customerRepository.findUnique({ where: { type: UserModel.Type.CUSTOMER, login: email, id }, select: { ...UserModel.UserWithoutPasswordSelectWithPeople } })

        if (!customerResult.isSuccess()) {
            if (customerResult.isErrorInOperation()) {
                throw new BadRequestException({ ...customerResult.getError(), title: 'Query Customer' })
            }

            throw new BadRequestException({ title: 'Query Customer', message: 'No customers with this email found' })
        }

        return customerResult.getValue()
    }

    private async updatePasswordById(password: string, id: ID) {
        const result = await this.customerRepository.update({
            data: { password },
            where: { id }
        })

        if (!result.isSuccess()) {
            throw new BadRequestException({ ...result.getError(), title: 'Update Password' })
        }
    }
}
