import { Module } from '@core'
import { PublicStaticModule } from '@public/public.module'

@Module({
    imports: [PublicStaticModule]
})
export class PublicModule { }