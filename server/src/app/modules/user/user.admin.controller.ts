import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Get, Put } from '@services/http.service'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'
import { UserUpdateUseCase } from '@modules/user/use-case/update.use-case'

@Controller({ prefix: '/users', domain: Domain.ADMIN })
export class UserAdminController {
    constructor(
        @Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase,
        @Injection.Inject('user.use-case.update') private updateUC: UserUpdateUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const result = await this.queryUC.queryManyWithPeopleWithoutPassword()

        return result
    }

    @Guard({ name: 'admin.authorization' })
    @Put('/:id')
    async update(req: Request) {
        const id = req.params['id']

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
