import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Controller } from '@server/components/controller'
import { Get, Post, Put } from '@server/components/router'
import { view } from '@modules/category/use-cases/view'
import { create } from '@modules/category/use-cases/create'
import { update } from '@modules/category/use-cases/update'
import { query, simpleQuery } from '@modules/category/use-cases/query'
import { CustomerBankAccountAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/categories' })
export class CustomerCategoryController {

    @Guard(CustomerBankAccountAuthorization)
    @Get()
    async query(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await query({ ...params, bankAccountId: { eq: req.bankAccount?.id || 0 } })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Get('/auto-complete/:name')
    async autoComplete(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await simpleQuery({ ...params, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Get('/:id')
    async view(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await view({ id: params.id, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Post('/create')
    async create(req: Request) {
        const body = req.body as any

        const result = await create({ ...body, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Put('/update/:id')
    async update(req: Request) {
        const body = req.body as any
        const params = req.params as any

        const result = await update({ ...body, id: params.id, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }
}