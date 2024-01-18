import { Request, Injection, Controller, Guard, Get, Post, Put } from '@core'
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
