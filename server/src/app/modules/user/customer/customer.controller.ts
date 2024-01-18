import { Request } from '@core'
import { Get, Put } from '@services/http.service'
import { Injection } from '@core'
import { Controller, Guard } from '@core'

@Controller({ prefix: '/customers' })
export class CustomerController {
    constructor() { }

}
