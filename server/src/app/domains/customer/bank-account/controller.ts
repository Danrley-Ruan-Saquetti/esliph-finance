import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Controller } from '@server/components/controller'
import { Get, Post, Put } from '@server/components/router'
import { view } from '@modules/bank-account/use-cases/view'
import { create } from '@modules/bank-account/use-cases/create'
import { update } from '@modules/bank-account/use-cases/update'
import { validSlug } from '@modules/bank-account/use-cases/valid-slug'
import { recalculateBalance } from '@modules/bank-account/use-cases/update-balance'
import { CustomerAuthorization, CustomerBankAccountAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/bank-accounts' })
export class CustomerBankAccountController {

    @Guard(CustomerBankAccountAuthorization)
    @Get()
    async view(req: Request) {
        const result = await view({ id: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerAuthorization)
    @Post('/create')
    async create(req: Request) {
        const body = req.body as any

        const result = await create({ ...body, peopleId: req.user?.peopleId })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Put('/update')
    async update(req: Request) {
        const body = req.body as any

        const result = await update({ ...body, id: req.bankAccount?.id || 0 })

        return result
    }

    @Guard(CustomerAuthorization)
    @Get('/valid-slug/:slug')
    async validSlug(req: Request) {
        const params = { ...req.params as any, ...req.query as any }

        const result = await validSlug({ ...params, peopleId: req.user?.peopleId || 0 })

        return result
    }

    @Guard(CustomerBankAccountAuthorization)
    @Post('/recalculate-balance')
    async recalculateBalance(req: Request) {
        const result = await recalculateBalance({ id: req.bankAccount?.id || 0 })

        return result
    }
}