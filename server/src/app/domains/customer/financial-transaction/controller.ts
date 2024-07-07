import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Delete, Get, Post, Put } from '@server/components/router'
import { Controller } from '@server/components/controller'
import { view } from '@modules/financial-transaction/use-cases/view'
import { query } from '@modules/financial-transaction/use-cases/query'
import { create } from '@modules/financial-transaction/use-cases/create'
import { update } from '@modules/financial-transaction/use-cases/update'
import { remove } from '@modules/financial-transaction/use-cases/remove'
import { queryCompensation } from '@modules/financial-transaction/use-cases/query-compensation'
import { CustomerBankAccountAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/financial-transactions' })
export class CustomerFinancialTransactionController {

    @Guard(CustomerBankAccountAuthorization)
    @Get()
    async query(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await query({ ...params, bankAccountId: { eq: req.bankAccount?.id } })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Get('/:id')
    async view(req: Request) {
        const params = req.params as any

        const result = await view({ id: params.id, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Get('/:id/compensation')
    async queryCompensation(req: Request) {
        const params = req.params as any

        const result = await queryCompensation({ id: params.id, bankAccountId: req.bankAccount?.id || 0 })

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
    @Put('/:id')
    async update(req: Request) {
        const body = req.body as any
        const { id } = req.params as any

        const result = await update({ ...body, id, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Delete('/:id')
    async remove(req: Request) {
        const { id } = req.params as any

        const result = await remove({ id, bankAccountId: req.bankAccount?.id || 0 })

        return result
    }
}