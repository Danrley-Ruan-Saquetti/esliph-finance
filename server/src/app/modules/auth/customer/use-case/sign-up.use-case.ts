import { Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { UserCreateUseCase, UserCreateUserAndPeopleDTOArgs } from '@modules/user/use-case/create.use-case'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'auth.customer.use-case.sign-up' })
export class AuthCustomerSignUpUseCase extends UseCase {
    constructor(@Injection.Inject('user.use-case.create') private userCreateUC: UserCreateUseCase) {
        super()
    }

    async perform(args: Omit<UserCreateUserAndPeopleDTOArgs, 'userType'>) {
        const createCustomerResult = await this.createCustomer(args)

        return createCustomerResult
    }

    private async createCustomer(args: Omit<UserCreateUserAndPeopleDTOArgs, 'userType'>) {
        const createCustomerResult = await this.userCreateUC.createUserAndPeople({ ...args, userType: UserModel.Type.CUSTOMER })

        return createCustomerResult
    }
}
