import { Module } from '@core'
import { DocsApiService } from '@public/static/docs-api/docs-api.service'
import { DocsApiController } from '@public/static/docs-api/docs-api.controller'

@Module({
    imports: [],
    controllers: [DocsApiController],
    providers: [DocsApiService]
})
export class DocsApiModule { }
