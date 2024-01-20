import { Controller, Domain } from '@core'

@Controller({ prefix: '/payments', domain: Domain.CUSTOMER })
export class PaymentController {
    constructor() { }
}
