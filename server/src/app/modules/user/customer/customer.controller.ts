import { Request, Injection, Controller, Guard } from '@core'
import { Get, Put } from '@services/http.service'

@Controller({ prefix: '/customers' })
export class CustomerController {
    constructor() { }

}
