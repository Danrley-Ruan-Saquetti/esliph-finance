import { Request, Injection, Controller, Guard, Get, Post, Put, Domain } from '@core'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'
import { PeopleQueryUseCase } from '@modules/people/use-case/query.use-case'

@Controller({ prefix: '/peoples', domain: Domain.ADMIN })
export class PeopleAdminController {
    constructor(
        @Injection.Inject('people.use-case.update') private updateUC: PeopleUpdateUseCase,
        @Injection.Inject('people.use-case.query') private queryUC: PeopleQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async update(req: Request) {
        const result = await this.queryUC.query({ ...req.params } as any)

        return result
    }
}
