import { Request } from '@esliph/http'
import { Get, Post, Put } from '@esliph/adapter-fastify'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'
import { CategoryQueryUseCase } from '@modules/category/use-case/query.use-case'
import { CategoryUpdateUseCase } from '@modules/category/use-case/update.use-case'

@Controller({ prefix: '/categories' })
export class CategoryController {
    constructor(
        @Injection.Inject('category.use-case.create') private createUC: CategoryCreateUseCase,
        @Injection.Inject('category.use-case.query') private queryUC: CategoryQueryUseCase,
        @Injection.Inject('category.use-case.update') private updateUC: CategoryUpdateUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async get(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.queryUC.queryManyByBankAccountId({ bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async getOne(req: Request) {
        const id = req.params['id']

        const result = await this.queryUC.queryById({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.createUC.perform({ ...req.body, bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Put('/:id/update')
    async update(req: Request) {
        const id = req.params['id']

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
