import { Controller, Domain, Get, Guard, Injection, Post, Request } from '@core'
import { JobQueryUseCase } from '@jobs/use-case/query.use-case'
import { JobExecuteUseCase } from '@jobs/use-case/execute.use-case'
import { JobStartUseCase } from '@jobs/use-case/start.use-case'
import { JobStopUseCase } from '@jobs/use-case/stop.use-case'

@Controller({ prefix: '/jobs', domain: Domain.ADMIN })
export class JobController {
    constructor(
        @Injection.Inject('job.use-case.query') private queryUC: JobQueryUseCase,
        @Injection.Inject('job.use-case.execute') private executeUC: JobExecuteUseCase,
        @Injection.Inject('job.use-case.start') private startUC: JobStartUseCase,
        @Injection.Inject('job.use-case.stop') private stopUC: JobStopUseCase,
    ) { }

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

    @Guard({ name: 'admin.authorization' })
    @Post('/:name/execute')
    execute(req: Request) {
        const result = this.executeUC.perform({ name: req.params['name'] })

        return result
    }

    @Guard({ name: 'admin.authorization' })
    @Post('/:name/start')
    start(req: Request) {
        const result = this.startUC.perform({ name: req.params['name'] })

        return result
    }

    @Guard({ name: 'admin.authorization' })
    @Post('/:name/stop')
    stop(req: Request) {
        const result = this.stopUC.perform({ name: req.params['name'] })

        return result
    }
}