import { Controller, Domain, Get, Injection, Request } from '@core'
import { DocsApiService } from '@public/static/docs-api/docs-api.service'

@Controller({ prefix: '/api', domain: Domain.DOCS })
export class DocsApiController {
    constructor(@Injection.Inject('docs-api.service') private service: DocsApiService) { }

    @Get('/content/:name')
    async get(req: Request) {
        const name = req.params['name']

        const result = await this.service.getContentByName(name)

        return result
    }
}