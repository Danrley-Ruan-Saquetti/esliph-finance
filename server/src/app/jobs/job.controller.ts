import { Controller, Domain, Get, Guard, Injection, Request } from '@core'
import { JobQueryUseCase } from '@jobs/use-case/query.use-case'

@Controller({ prefix: '/jobs', domain: Domain.ADMIN })
export class JobController {
    constructor(@Injection.Inject('job.use-case.query') private queryUC: JobQueryUseCase) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    get(req: Request) {
        const result = this.queryUC.query({ ...req.params })

        return result
    }

    @Guard({ name: 'admin.authorization' })
    @Get('/:name')
    getByName(req: Request) {
        const result = this.queryUC.queryByName(req.params['name'])

        return result
    }
}