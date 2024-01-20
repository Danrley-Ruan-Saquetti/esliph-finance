import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'
import { AddressQueryUseCase } from '@modules/address/use-case/query.use-case'
import { AddressCreateUseCase } from '@modules/address/use-case/create.use-case'

@Controller({ prefix: '/address', domain: Domain.CUSTOMER })
export class AddressController {
    constructor(
        @Injection.Inject('address.use-case.create') private createUC: AddressCreateUseCase,
        @Injection.Inject('address.use-case.query') private queryUC: AddressQueryUseCase
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Get('')
    async get(req: Request) {
        const peopleId = req.headers['peopleId']

        const result = await this.queryUC.queryManyByPeopleId({ peopleId })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Get('/:id')
    async getAddress(req: Request) {
        const peopleId = req.headers['peopleId']
        const id = req.params['id']

        const result = await this.queryUC.queryByIdAndPeopleId({ peopleId, id })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Post('')
    async create(req: Request) {
        const peopleId = req.headers['peopleId']

        const result = await this.createUC.perform({ addresses: [{ ...req.body }], peopleId })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Put('/:id')
    async update(req: Request) {
        const peopleId = req.headers['peopleId']
        const id = req.params['id']

        const result = await this.queryUC.queryByIdAndPeopleId({ id, peopleId })

        return result
    }
}
