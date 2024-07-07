import { Guard } from '@server/components/guard'
import { Get, Post } from '@server/components/router'
import { Controller } from '@server/components/controller'
import type { Request, Response } from '@@types/http'
import { view } from '@modules/user/use-cases/view'
import { CustomerAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/users' })
export class CustomerUserController {

    @Guard(CustomerAuthorization)
    @Get()
    async view(req: Request, _: Response) {
        const result = await view({ id: req.user?.sub || 0 })

        return result
    }
}