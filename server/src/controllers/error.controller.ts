import { Controller, CoreModule, Domain } from '@core'

@Controller({ prefix: '/errors', domain: Domain.LOCAL })
export class ErrorController {
    constructor() { }

    @CoreModule.Post('/create')
    async dispatchError(data: any) {
        console.log(data)
    }
}
