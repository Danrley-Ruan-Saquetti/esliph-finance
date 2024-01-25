import { HttpStatusCodes, Request, Get, Post, Put, Injection, Controller, Guard, HttpStatusCode, Domain } from '@core'
import { Json, isUndefined } from '@util'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'
import { CategoryQueryUseCase } from '@modules/category/use-case/query.use-case'
import { CategoryUpdateUseCase } from '@modules/category/use-case/update.use-case'

@Controller({ prefix: '/categories', domain: Domain.CUSTOMER })
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
        const filters = req.params
        const isFavoriteResult = Json.parse<boolean>(filters.isFavorite)

        if (!isFavoriteResult.isSuccess()) {
            return isFavoriteResult
        }

        const result = await this.queryUC.queryMany({
            ...filters,
            isFavorite: !isUndefined(filters.isFavorite) ? isFavoriteResult.getValue() : undefined,
            bankAccountId
        })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async getOne(req: Request) {
        const bankAccountId = req.headers['bankAccountId']
        const id = req.params['id']

        const result = await this.queryUC.queryByIdAndBankAccountId({ bankAccountId, id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('')
    @HttpStatusCode(HttpStatusCodes.CREATED)
    async create(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.createUC.perform({ ...req.body, bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Put('/:id')
    async update(req: Request) {
        const id = req.params['id']

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
