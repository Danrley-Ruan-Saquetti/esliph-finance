import { Injection, Result, Service } from '@core'
import { GLOBAL_APP, GLOBAL_MAIL_CONFIG, GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { ID, PayloadJWTCustomerResetPassword } from '@@types'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator } from '@services/validator.service'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions/bad-request.exception'
import { CustomerForgetPasswordTemplate } from '@templates/forget-password'
import { UserModel } from '@modules/user/user.model'
import { CustomerRepository } from '@modules/user/customer/customer.repository'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'

const schemaDTO = SchemaValidator.object({
    login: SchemaValidator
        .string({ 'required_error': GLOBAL_USER_DTO.login.messageRequired })
        .max(GLOBAL_USER_DTO.login.maxCharacters, { message: GLOBAL_USER_DTO.login.messageRangeCharacters })
        .trim(),
})

export type AuthCustomerForgetPasswordDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.customer.use-case.forget-password' })
export class AuthCustomerForgetPasswordUseCase extends UseCase {
    constructor(
        @Injection.Inject('jwt') private jwt: JWTService,
        @Injection.Inject('customer.repository') private customerRepository: CustomerRepository,
        @Injection.Inject('mail.use-case.create') private mailCreate: MailCreateUseCase,
    ) {
        super()
    }

    async perform(data: AuthCustomerForgetPasswordDTOArgs) {
        const { login } = this.validateDTO(data, schemaDTO)

        const user = await this.queryCustomerByLoginOrCodeOrItinCnpj(login)

        const token = this.generateToken({ sub: user.id, email: user.login, name: user.people.name })

        const contentResult = CustomerForgetPasswordTemplate({
            email: user.login,
            token,
            name: user.people.name
        })

        if (!contentResult.isSuccess()) {
            throw new BadRequestException({ ...contentResult.getError(), message: '', title: '' })
        }

        await this.mailCreate.perform({
            sender: `${GLOBAL_APP.name} <${GLOBAL_MAIL_CONFIG.domain}>`,
            recipient: user.login,
            subject: 'Reset your password',
            content: contentResult.getValue()
        })

        const emailMask = this.maskDataService.between(user.login, {
            character: '*',
            indexStart: 3,
            indexEnd: 3
        })

        return Result.success({ message: `An email was sent to ${emailMask}. Check your inbox to reset your password` })
    }

    private generateToken({ sub, email, name }: { sub: ID, email: string, name: string }) {
        const token = this.jwt.encode<PayloadJWTCustomerResetPassword>({ email, name, sub }, {
            secret: GLOBAL_SERVER_JWT_TOKEN.keyResetPassword,
            exp: GLOBAL_SERVER_JWT_TOKEN.resetPasswordExpiresTime,
        })

        return token
    }

    private async queryCustomerByLoginOrCodeOrItinCnpj(login: string) {
        const customerResult = await this.customerRepository.findFirst({
            where: {
                type: UserModel.Type.CUSTOMER,
                OR: [
                    { login },
                    { code: login },
                    { people: { itinCnpj: login } }
                ]
            },
            select: { ...UserModel.UserWithoutPasswordSelectWithPeople }
        })

        if (!customerResult.isSuccess()) {
            if (customerResult.isErrorInOperation()) {
                throw new BadRequestException({ ...customerResult.getError(), title: 'Query Customer' })
            }

            throw new BadRequestException({ title: 'Query Customer', message: 'No customers with this email found' })
        }

        return customerResult.getValue()
    }
}
