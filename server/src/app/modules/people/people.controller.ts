import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { Get, Post, Put } from '@esliph/adapter-fastify'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'

@Controller({ prefix: '/peoples' })
export class PeopleController {
    constructor(
        @Injection.Inject('people.use-case.update') private updateUC: PeopleUpdateUseCase,
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Put('/current')
    async update(req: Request) {
        const peopleId = req.headers['peopleId']

        const result = await this.updateUC.perform({ ...req.body, id: peopleId })

        return result
    }
}
