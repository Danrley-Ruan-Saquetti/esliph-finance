import { Module } from '@core'
import { DocsApiModule } from '@public/static/docs-api/docs-api.module'

@Module({
    imports: [DocsApiModule]
})
export class PublicStaticModule { }
