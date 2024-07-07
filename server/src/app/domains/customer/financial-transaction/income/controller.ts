import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Get, Post } from '@server/components/router'
import { Controller } from '@server/components/controller'
import { query } from '@modules/financial-transaction/use-cases/query'
import { create } from '@modules/financial-transaction/use-cases/create'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { CustomerBankAccountAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/financial-transactions/income' })
export class CustomerFinancialTransactionIncomeController {

    @Guard(CustomerBankAccountAuthorization)
    @Get()
    async query(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await query({ ...params, bankAccountId: { eq: req.bankAccount?.id }, type: { eq: FinancialTransactionModel.Type.INCOME } })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Post('/create')
    async create(req: Request) {
        const body = req.body as any

        const result = await create({ ...body, bankAccountId: req.bankAccount?.id, type: FinancialTransactionModel.Type.INCOME })

        return result
    }
}