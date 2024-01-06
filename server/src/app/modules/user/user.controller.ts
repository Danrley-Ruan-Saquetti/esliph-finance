import { Request } from '@esliph/http'
import { Get, Put } from '@services/http.service'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'
import { UserUpdateUseCase } from '@modules/user/use-case/update.use-case'

@Controller({ prefix: '/users' })
export class UserController {
    constructor(
        @Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase,
        @Injection.Inject('user.use-case.update') private updateUC: UserUpdateUseCase,
    ) { }

    @Guard({ name: 'user.authorization' })
    @Get('/current')
    async get(req: Request) {
        const id = req.headers['userId']

        const result = await this.queryUC.queryByIdWithoutPassword({ id })

        return result
    }

    @Guard({ name: 'user.authorization' })
    @Put('/update')
    async update(req: Request) {
        const id = req.headers['userId']

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
