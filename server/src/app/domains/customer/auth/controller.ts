import type { Request } from '@@types/http'
import { Post } from '@server/components/router'
import { Guard } from '@server/components/guard'
import { Controller } from '@server/components/controller'
import { singUp } from '@modules/auth/customer/use-cases/sing-up'
import { UserModel } from '@modules/user/model'
import { singIn as customerSingIn } from '@modules/auth/use-cases/sing-in'
import { singIn as bankAccountSingIn } from '@modules/auth/customer/use-cases/sing-in-bank-account'
import { CustomerAuthorization } from '@domains/customer/auth/filter'

@Controller({ prefix: '/auth' })
export class CustomerAuthController {

    @Post('/sing-up')
    async singUp(req: Request) {
        const body = req.body as any

        const result = await singUp({ ...body, userType: UserModel.Type.CUSTOMER })

        return result
    }

    @Post('/sing-in')
    async singIn(req: Request) {
        const body = req.body as any

        const result = await customerSingIn({ ...body, type: UserModel.Type.CUSTOMER })

        return result
    }
}

@Controller({ prefix: '/auth/bank-account' })
export class CustomerBankAccountAuthController {

    @Guard(CustomerAuthorization)
    @Post('/sing-in')
    async singIn(req: Request) {
        const body = req.body as any

        const result = await bankAccountSingIn({ ...body, userId: req.user?.sub })

        return result
    }
}