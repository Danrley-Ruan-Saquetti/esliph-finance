import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthUserExistsUseCase } from '@modules/auth/user/use-case/exists.use-case'

@Filter({ name: 'user.filter.exists' })
export class UserExistsFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.user.use-case.exists') private existsUC: AuthUserExistsUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const { userId } = req.headers

        console.log(userId)

        await this.existsUC.perform({ userId })
    }
}
