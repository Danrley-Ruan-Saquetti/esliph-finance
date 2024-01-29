import { Result, Injection, Service } from '@core'
import { ApiService } from '@services/api.service'
import { isFalsy, replaceSpecialCharacters } from '@util'

export namespace PlaceModel {
    export type State = {
        id: number,
        state: string,
        name: string,
    }
    export type CitySimple = {
        id: number,
        name: string
    }

    export type City = {
        UF: string
        zipCode: string
        street: string
        neighborhood: string
        city: string
    }
}

@Service({ name: 'place.repository' })
export class PlaceRepository {
    private static BASE_URL_ORIGINS = {
        ZIP_CODE: 'https://viacep.com.br/ws',
        PLACE: 'https://servicodados.ibge.gov.br/api/v1/localidades'
    }

    constructor(@Injection.Inject('global.service.api') private api: ApiService) { }

    async queryStatesByUFAndName(UF: string, name: string) {
        const stateResult = await this.queryStatesByName(name)

        if (!stateResult.isSuccess()) {
            return Result.failure<PlaceModel.State[]>({ ...stateResult.getError() })
        }

        const state = stateResult.getValue().filter(({ state }) => replaceSpecialCharacters(state).includes(replaceSpecialCharacters(UF).toUpperCase()))

        return Result.success<PlaceModel.State[]>(state)
    }

    async queryStatesByName(name: string) {
        name = name.trim()

        const stateResult = await this.queryStates()

        if (!stateResult.isSuccess()) {
            return Result.failure<PlaceModel.State[]>({ ...stateResult.getError() })
        }

        const states = stateResult.getValue().filter(({ name: nameState }) => replaceSpecialCharacters(nameState).toLowerCase().includes(replaceSpecialCharacters(name).toLowerCase()))

        return Result.success<PlaceModel.State[]>(states)
    }

    async queryStateByUF(UF: string) {
        UF = UF.trim()

        if (!UF) {
            return Result.failure<PlaceModel.State>({ title: 'Query State', message: 'State not found' })
        }

        const stateResult = await this.API.get<any>(`/estados/${UF.toUpperCase()}`)

        if (!stateResult.isSuccess() || isFalsy(stateResult.getValue().data)) {
            return Result.failure<PlaceModel.State>({ ...stateResult.getError(), message: 'State not found', title: 'Query State' })
        }

        return Result.success<PlaceModel.State>({
            id: stateResult.getValue().data.id,
            name: stateResult.getValue().data.nome,
            state: stateResult.getValue().data.sigla,
        })
    }

    async queryStates() {
        const statesResult = await this.API.get<any[]>('/estados?orderBy=nome', { baseURL: PlaceRepository.BASE_URL_ORIGINS.PLACE })

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.State[]>({ ...statesResult.getError() })
        }

        return Result.success<PlaceModel.State[]>(statesResult.getValue().data.map(({ id, sigla: state, nome: name }) => ({ id, name, state })))
    }

    async queryCities({ UF = '', name = '' }: { UF: string, name?: string }) {
        UF = UF.trim()

        if (!UF) {
            return Result.failure<any[]>({ title: 'Query Cities', message: 'State not found' })
        }

        const statesResult = await this.API.get<any[]>(`/estados/${UF}/municipios?orderBy=nome&?view=nivelado`, { baseURL: PlaceRepository.BASE_URL_ORIGINS.PLACE })

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.CitySimple[]>({ ...statesResult.getError(), title: 'Query Cities' })
        }

        const states = statesResult.getValue().data.filter(({ nome: nameState }) => replaceSpecialCharacters(nameState).toLowerCase().includes(replaceSpecialCharacters(name).toLowerCase()))

        return Result.success<PlaceModel.CitySimple[]>(states.map(({ id, nome: name }) => ({ id, name })))
    }

    async queryCity({ id }: { id: number }) {
        const statesResult = await this.API.get<any>(`/municipios/${id}`, { baseURL: PlaceRepository.BASE_URL_ORIGINS.PLACE })

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.CitySimple>({ ...statesResult.getError(), title: 'Query Cities' })
        }

        return Result.success<PlaceModel.CitySimple>({ id: statesResult.getValue().data.id, name: statesResult.getValue().data.nome })
    }

    async queryZipCode({ UF = '', city = '', street = '' }: { UF: string, city: string, street: string }) {
        const statesResult = await this.API.get<any[]>(`/${UF.trim()}/${city.trim()}/${street.trim()}/json`, { baseURL: PlaceRepository.BASE_URL_ORIGINS.ZIP_CODE })

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City[]>({ ...statesResult.getError(), title: 'Query ZIP Code' })
        }

        return Result.success<PlaceModel.City[]>((statesResult.getValue().data || []).map(({ cep: zipCode, logradouro: street, bairro: neighborhood, localidade: city, uf: UF }) => ({
            UF,
            city,
            zipCode,
            neighborhood,
            street,
        })))
    }

    async queryCityByZipCode({ zipCode = '' }: { zipCode: string }) {
        const statesResult = await this.API.get<any>(`/${zipCode.trim()}/json`, { baseURL: PlaceRepository.BASE_URL_ORIGINS.ZIP_CODE })

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City>({ ...statesResult.getError(), title: 'Query City' })
        }

        return Result.success<PlaceModel.City>({
            zipCode: statesResult.getValue().data.cep, street: statesResult.getValue().data.logradouro, neighborhood: statesResult.getValue().data.bairro, city: statesResult.getValue().data.localidade, UF: statesResult.getValue().data.uf
        })
    }

    get API() {
        return this.api
    }
}
