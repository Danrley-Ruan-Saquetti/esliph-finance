import { Module } from '@core'
import { BlockRouterFilter } from '@filters/block-router.filter'

@Module({
    providers: [
        BlockRouterFilter,
        { whenCall: 'block-router', use: 'global.filter.block-router' }
    ]
})
export class FilterModule { }
