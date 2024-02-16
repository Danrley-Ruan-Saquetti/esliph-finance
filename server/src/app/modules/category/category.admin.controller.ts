import { HttpStatusCodes, Request, Get, Post, Put, Injection, Controller, Guard, HttpStatusCode, Domain } from '@core'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'
import { CategoryQueryUseCase } from '@modules/category/use-case/query.use-case'
import { CategoryUpdateUseCase } from '@modules/category/use-case/update.use-case'

@Controller({ prefix: '/categories', domain: Domain.ADMIN })
export class CategoryAdminController {
    constructor(
        @Injection.Inject('category.use-case.query') private queryUC: CategoryQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const filters = req.params

        const result = await this.queryUC.query({ ...filters })

        return result
    }
}
