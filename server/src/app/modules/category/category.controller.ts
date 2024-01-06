import { Request } from '@esliph/http'
import { Post } from '@esliph/adapter-fastify'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'

@Controller({ prefix: '/categories' })
export class CategoryController {
    constructor(
        @Injection.Inject('category.use-case.create') private createUC: CategoryCreateUseCase
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.createUC.perform({ ...req.body, bankAccountId })

        return result
    }
}
