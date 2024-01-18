import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ApiService } from '@services/api.service'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
import { GLOBAL_LOG_CONFIG } from '@global'

export namespace PlaceModel {
    export type State = {
        id: number,
        sigla: string,
        nome: string,
        regiao: { id: number, sigla: string, nome: string }
    }
    export type City = {
        id: number,
        nome: string
        microrregiao: {
            id: number,
            nome: string
            mesorregiao: {
                id: number,
                nome: string
                UF: {
                    id: number,
                    sigla: string
                    nome: string
                    regiao: {
                        id: number,
                        sigla: string
                        nome: string
                    }
                }
            }
        },
        'regiao-imediata': {
            id: number,
            nome: string
            'regiao-intermediaria': {
                id: number,
                nome: string
                UF: {
                    id: number,
                    sigla: string
                    nome: string
                    regiao: {
                        id: number,
                        sigla: string
                        nome: string
                    }
                }
            }
        }
    }
}

@Service({ name: 'place.repository' })
export class PlaceRepository {
    constructor(@Injection.Inject('global.service.api') private api: ApiService) {
        this.api.setOptions({
            baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
        })
    }

    async queryStates() {
        const statesResult = await placeService.API.get<PlaceModel.State[]>('/estados?orderBy=nome')

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.State[]>({ ...statesResult.getError() })
        }
        return Result.success<PlaceModel.State[]>(statesResult.getValue().data)
    }

    async queryState({ UF = '' }: { UF: string }) {
        UF = UF.trim()

        if (!UF) {
            return Result.failure<PlaceModel.State>({ title: 'Query State', message: 'State not found' })
        }

        const statesResult = await placeService.API.get<PlaceModel.State>(`/estados/${UF}`)

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.State>({ ...statesResult.getError(), title: 'Query State' })
        }
        return Result.success<PlaceModel.State>(statesResult.getValue().data)
    }

    async queryCities({ UF = '' }: { UF: string }) {
        UF = UF.trim()

        if (!UF) {
            return Result.failure<PlaceModel.City[]>({ title: 'Query Cities', message: 'State not found' })
        }

        const statesResult = await placeService.API.get<PlaceModel.City[]>(`/estados/${UF}/municipios?orderBy=nome&?view=nivelado`)

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City[]>({ ...statesResult.getError(), title: 'Query Cities' })
        }
        return Result.success<PlaceModel.City[]>(statesResult.getValue().data)
    }

    async queryCity({ id }: { id: number }) {
        const statesResult = await placeService.API.get<PlaceModel.City>(`/municipios/${id}`)

        if (!statesResult.isSuccess()) {
            return Result.failure<PlaceModel.City>({ ...statesResult.getError(), title: 'Query Cities' })
        }
        return Result.success<PlaceModel.City>(statesResult.getValue().data)
    }

    get API() {
        return this.api
    }
}

const placeService = new PlaceRepository(new ApiService())

async function App() {
    console.log((await placeService.queryCity({ id: 4206900 })).getValue())
}

App()