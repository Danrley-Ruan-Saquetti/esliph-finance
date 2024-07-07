import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Get, Post, Put } from '@server/components/router'
import { Controller } from '@server/components/controller'
import { view } from '@modules/payment/use-cases/view'
import { query } from '@modules/payment/use-cases/query'
import { create } from '@modules/payment/use-cases/create'
import { update } from '@modules/payment/use-cases/update'
import { CustomerBankAccountAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/financial-transactions/:financialTransactionId/payments' })
export class CustomerFinancialTransactionPaymentController {

    @Guard(CustomerBankAccountAuthorization)
    @Get()
    async query(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await query({
            ...params,
            bankAccountId: { eq: req.bankAccount?.id },
            bankAccount: undefined,
            financialTransactionId: { eq: params.financialTransactionId },
            financialTransaction: undefined,
            financialTransactionValue: undefined,
        })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Get('/:id')
    async view(req: Request) {
        const params = req.params as any

        const result = await view({
            id: params.id,
            financialTransactionId: params.financialTransactionId || 0,
            bankAccountId: req.bankAccount?.id || 0,
        })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Post('/create')
    async create(req: Request) {
        const body = req.body as any
        const params = { ...req.params as any }

        const result = await create({ ...body, ...params, bankAccountId: req.bankAccount?.id })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Put('/update/:id')
    async update(req: Request) {
        const body = req.body as any
        const { id } = req.params as any

        const result = await update({ ...body, id, bankAccountId: req.bankAccount?.id })

        return result
    }
}