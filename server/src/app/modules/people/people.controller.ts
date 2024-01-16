import { Request } from '@esliph/http'
import { Get, Post, Put } from '@esliph/adapter-fastify'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'
import { AddressQueryUseCase } from '@modules/address/use-case/query.use-case'

@Controller({ prefix: '/peoples' })
export class PeopleController {
    constructor(@Injection.Inject('people.use-case.update') private updateUC: PeopleUpdateUseCase,
        @Injection.Inject('address.use-case.query') private queryAddressUC: AddressQueryUseCase
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Put('/current/update')
    async update(req: Request) {
        const peopleId = req.headers['peopleId']

        const result = await this.updateUC.perform({ ...req.body, id: peopleId })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Put('/current/address')
    async getAddress(req: Request) {
        const peopleId = req.headers['peopleId']

        const result = await this.queryAddressUC.queryManyByPeopleId({ peopleId })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Put('/current/address/:id')
    async getUniqueAddress(req: Request) {
        const peopleId = req.headers['peopleId']
        const id = req.params['id']

        const result = await this.queryAddressUC.queryByIdAndPeopleId({ id, peopleId })

        return result
    }
}
