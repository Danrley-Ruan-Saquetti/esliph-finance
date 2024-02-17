import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Get, Put } from '@services/http.service'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'

@Controller({ prefix: '/users', domain: Domain.ADMIN })
export class UserAdminController {
    constructor(
        @Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const result = await this.queryUC.query({ ...req.params })

        return result
    }
}
