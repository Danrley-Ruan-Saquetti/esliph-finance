import type { Request } from '@@types/http'
import { Guard } from '@server/components/guard'
import { Get, Put } from '@server/components/router'
import { Controller } from '@server/components/controller'
import { update } from '@modules/people/use-cases/update'
import { view } from '@modules/people/use-cases/view'
import { CustomerAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/peoples' })
export class CustomerPeopleController {

    @Guard(CustomerAuthorization)
    @Get()
    async view(req: Request) {
        const result = await view({ id: req.user?.peopleId || 0 })

        return result
    }

    @Guard(CustomerAuthorization)
    @Put('/update')
    async update(req: Request) {
        const body = req.body as any

        const result = await update({ ...body, id: req.user?.peopleId })

        return result
    }
}