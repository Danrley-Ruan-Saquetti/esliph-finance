import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { UserCreateUseCase, UserCreateUserAndPeopleDTOArgs } from '@modules/user/use-case/create.use-case'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'auth.user.use-case.sign-up' })
export class AuthClientSignUpUseCase extends UseCase {
    constructor(@Injection.Inject('user.use-case.create') private userCreateUC: UserCreateUseCase) {
        super()
    }

    async perform(args: Omit<UserCreateUserAndPeopleDTOArgs, 'userType'>) {
        const createClientResult = await this.createClient(args)

        return createClientResult
    }

    private async createClient(args: Omit<UserCreateUserAndPeopleDTOArgs, 'userType'>) {
        const createClientResult = await this.userCreateUC.createUserAndPeople({ ...args, userType: UserModel.Type.CLIENT })

        return createClientResult
    }
}
