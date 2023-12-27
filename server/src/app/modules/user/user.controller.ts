import { Request } from '@esliph/http'
import { Get } from '@services/http.service'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'

@Controller({ prefix: '/users' })
export class UserController {
    constructor(@Injection.Inject('user.use-case.query') private queryUX: UserQueryUseCase) { }

    @Guard({ name: 'user.authorization' })
    @Get('/:id')
    async get(req: Request) {
        const { id } = req.params

        const result = await this.queryUX.queryByIdWithoutPassword({ id })

        return result
    }
}
