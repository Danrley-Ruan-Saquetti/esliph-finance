import { Request, Response } from '@@types/http'
import { FilterRouter } from '@server/components/filter'
import { authorization } from '@modules/auth/use-cases/authorization'
import { jwtServiceCustomer, jwtServiceBankAccount } from '@modules/auth/customer/global'

export class CustomerAuthorization implements FilterRouter {
    async perform(req: Request, _: Response) {
        const token = req.headers['authorization'] + ''

        const result = authorization({ token }, jwtServiceCustomer)

        req.user = {
            sub: result.sub,
            peopleId: result.peopleId,
        }
    }
}

export class CustomerBankAccountAuthorization implements FilterRouter {
    async perform(req: Request, _: Response) {
        const token = req.headers['authorization'] + ''

        const result = authorization({ token }, jwtServiceBankAccount)

        req.user = {
            sub: result.sub,
            peopleId: result.peopleId,
        }
        req.bankAccount = {
            id: result.id,
            slug: result.slug,
        }
    }
}