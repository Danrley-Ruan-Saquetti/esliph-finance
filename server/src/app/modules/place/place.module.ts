import { Module } from '@core'
import { PlaceController } from '@modules/place/place.controller'
import { PlaceUseCaseModule } from '@modules/place/use-case/use-case.module'
import { PlaceRepository } from '@modules/place/place.repository'

@Module({
    imports: [PlaceUseCaseModule],
    controllers: [PlaceController],
    providers: [PlaceRepository]
})
export class PlaceModule { }