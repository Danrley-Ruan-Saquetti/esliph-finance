import { Module } from '@core'
import { PlaceQueryUseCase } from '@modules/place/use-case/query.use-case'

@Module({
    providers: [PlaceQueryUseCase]
})
export class PlaceUseCaseModule { }