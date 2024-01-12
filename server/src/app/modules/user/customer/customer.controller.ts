import { Request } from '@esliph/http'
import { Get, Put } from '@services/http.service'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'

@Controller({ prefix: '/customers' })
export class CustomerController {
    constructor() { }

}
