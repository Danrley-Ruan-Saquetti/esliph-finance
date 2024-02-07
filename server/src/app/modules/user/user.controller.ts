import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Get, Put } from '@services/http.service'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'
import { UserUpdateUseCase } from '@modules/user/use-case/update.use-case'

@Controller({ prefix: '/users', domain: Domain.CLIENT })
export class UserController {
    constructor(
        @Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase,
        @Injection.Inject('user.use-case.update') private updateUC: UserUpdateUseCase,
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Get('/current')
    async get(req: Request) {
        const id = req.headers['peopleId']

        const result = await this.queryUC.queryWithPeopleByIdWithoutPassword({ id })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Put('')
    async update(req: Request) {
        const id = req.headers['userId']

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
