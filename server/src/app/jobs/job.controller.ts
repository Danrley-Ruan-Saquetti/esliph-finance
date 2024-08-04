import type { Request } from '@@types/http'
import { Get, Post } from '@server/components/router'
import { Controller } from '@server/components/controller'
import { stop } from '@jobs/use-case/stop'
import { start } from '@jobs/use-case/start'
import { execute } from '@jobs/use-case/execute'
import { query, queryByName } from '@jobs/use-case/query'

@Controller({ prefix: '/jobs' })
export class JobController {

    // @Guard()
    @Get('')
    get(req: Request) {
        const params = req.params as any

        const result = query({ ...params })

        return result
    }

    // @Guard()
    @Get('/:name')
    getByName(req: Request) {
        const params = req.params as any

        const result = queryByName(params['name'])

        return result
    }

    // @Guard()
    @Post('/:name/execute')
    execute(req: Request) {
        const params = req.params as any

        const result = execute({ name: params['name'] })

        return result
    }

    // @Guard()
    @Post('/:name/start')
    start(req: Request) {
        const params = req.params as any

        const result = start({ name: params['name'] })

        return result
    }

    // @Guard()
    @Post('/:name/stop')
    stop(req: Request) {
        const params = req.params as any

        const result = stop({ name: params['name'] })

        return result
    }
}