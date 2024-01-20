import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Get, Put } from '@services/http.service'

@Controller({ prefix: '/customers', domain: Domain.CUSTOMER })
export class CustomerController {
    constructor() { }

}
