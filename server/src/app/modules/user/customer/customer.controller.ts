import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Get, Put } from '@services/http.service'

@Controller({ prefix: '/customers', domain: Domain.CLIENT })
export class CustomerController {
    constructor() { }

}
