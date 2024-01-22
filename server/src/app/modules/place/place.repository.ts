import { Result, Injection, Service } from '@core'
import { ApiService } from '@services/api.service'
import { isFalsy, replaceSpecialCharacters } from '@util'

export namespace PlaceModel {
    export type State = {
        id: number,
        state: string,
        name: string,
    }
    export type City = {
        id: number,
        name: string
    }
}

@Service({ name: 'place.repository' })
export class PlaceRepository {
    constructor(@Injection.Inject('global.service.api') private api: ApiService) {
        this.api.setOptions({
            baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
        })
    }

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
        const statesResult = await this.API.get<any[]>('/estados?orderBy=nome')

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

        const statesResult = await this.API.get<any[]>(`/estados/${UF}/municipios?orderBy=nome&?view=nivelado`)

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City[]>({ ...statesResult.getError(), title: 'Query Cities' })
        }

        const states = statesResult.getValue().data.filter(({ nome: nameState }) => replaceSpecialCharacters(nameState).toLowerCase().includes(replaceSpecialCharacters(name).toLowerCase()))

        return Result.success<PlaceModel.City[]>(states.map(({ id, nome: name }) => ({ id, name })))
    }

    async queryCity({ id }: { id: number }) {
        const statesResult = await this.API.get<any>(`/municipios/${id}`)

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City>({ ...statesResult.getError(), title: 'Query Cities' })
        }

        return Result.success<PlaceModel.City>({ id: statesResult.getValue().data.id, name: statesResult.getValue().data.nome })
    }

    get API() {
        return this.api
    }
}
