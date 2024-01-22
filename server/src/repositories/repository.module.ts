import { Module } from '@core'
import { PlaceRepository } from '@repositories/place.repository'

@Module({
    imports: [PlaceRepository]
})
export class RepositoryModule { }
