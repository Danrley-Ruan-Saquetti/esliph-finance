import { Controller, Domain, Get, Injection } from '@core'
import { DocsApiService } from '@public/static/docs-api/docs-api.service'

@Controller({ prefix: '/api', domain: Domain.DOCS })
export class DocsApiController {
    constructor(@Injection.Inject('docs-api.service') private service: DocsApiService) { }

    @Get('')
    get() {
        return { hello: 'world' }
    }
}