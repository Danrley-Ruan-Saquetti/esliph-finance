import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ApiService } from '@services/api.service'

@Service({ name: 'place.repository' })
export class PlaceRepository {
    constructor(@Injection.Inject('global.service.api') private api: ApiService) {
        this.api.setOptions({
            baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',

        })
    }

    get API() {
        return this.api
    }
}

const placeService = new PlaceRepository(new ApiService())

async function App() {
    const result = await placeService.API.get('https://servicodados.ibge.gov.br/api/v1/localidades/distritos')

    console.log(result)
}

App()