import { Request, Get, Injection, Controller, Domain } from '@core'
import { PlaceQueryUseCase } from '@modules/place/use-case/query.use-case'

@Controller({ prefix: '/places', domain: Domain.PUBLIC })
export class PlaceController {
    constructor(@Injection.Inject('place.use-case.query') private queryUC: PlaceQueryUseCase) { }

    @Get('/states')
    async getStates(req: Request) {
        const UF = req.params['UF']
        const name = req.params['name']

        if (!UF && !name) {
            const result = await this.queryUC.queryStates()

            return result
        } else {
            if (!name) {
                const result = await this.queryUC.queryStateByUF({ UF })

                return result
            }
            if (!UF) {
                const result = await this.queryUC.queryStatesByName({ name })

                return result
            }
        }

        const result = await this.queryUC.queryStatesByUFAndName({ name, UF })

        return result
    }

    @Get('/states/:UF/cities')
    async getCities(req: Request) {
        const UF = req.params['UF']
        const name = req.params['name']

        const result = await this.queryUC.queryCitiesByUFAndName({ name, UF })

        return result
    }

    @Get('/cities/:zipCode')
    async getCityByZipCode(req: Request) {
        const zipCode = req.params['zipCode']

        const result = await this.queryUC.queryCityByZipCode({ zipCode })

        return result
    }
}
