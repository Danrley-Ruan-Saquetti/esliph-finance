import { Injection, Service, Result } from '@core'
import { UseCase } from '@common/use-case'
import { PlaceRepository } from '@modules/place/place.repository'

@Service({ name: 'place.use-case.query' })
export class PlaceQueryUseCase extends UseCase {
    constructor(@Injection.Inject('place.repository') private placeRepository: PlaceRepository) {
        super()
    }

    async queryStates() {
        const placeResult = await this.placeRepository.queryStates()

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query states' })
        }

        return Result.success(placeResult.getValue())
    }

    async queryStatesByName({ name = '' }: { name: string }) {
        const placeResult = await this.placeRepository.queryStatesByName(name)

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query states' })
        }

        return Result.success(placeResult.getValue())
    }

    async queryStateByUF({ UF = '' }: { UF: string }) {
        const placeResult = await this.placeRepository.queryStateByUF(UF)

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query state' })
        }

        return Result.success([placeResult.getValue()])
    }

    async queryStatesByUFAndName({ UF = '', name = '' }: { UF: string, name: string }) {
        const placeResult = await this.placeRepository.queryStatesByUFAndName(UF, name)

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query states' })
        }

        return Result.success(placeResult.getValue())
    }

    async queryCitiesByUFAndName({ UF = '', name = '' }: { UF: string, name?: string }) {
        const placeResult = await this.placeRepository.queryCities({ UF, name })

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query cities' })
        }

        return Result.success(placeResult.getValue())
    }

    async queryCityByZipCode({ zipCode = '' }: { zipCode: string }) {
        const placeResult = await this.placeRepository.queryCityByZipCode({ zipCode })

        if (!placeResult.isSuccess()) {
            return Result.failure({ ...placeResult.getError(), title: 'Query city' })
        }

        return Result.success(placeResult.getValue())
    }
}
