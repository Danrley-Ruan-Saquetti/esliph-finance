import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { UserCreateUseCase, UserCreateDTOArgs } from '@modules/user/use-case/create.use-case'

@Service({ name: 'auth.user.use-case.sign-up' })
export class AuthUserSignUpUseCase extends UseCase {
    constructor(@Injection.Inject('user.use-case.create') private userCreateUC: UserCreateUseCase) {
        super()
    }

    async perform(args: UserCreateDTOArgs) {
        const createUserResult = await this.createUser(args)

        return createUserResult
    }

    private async createUser(args: UserCreateDTOArgs) {
        const createUserResult = await this.userCreateUC.perform(args)

        return createUserResult
    }
}
