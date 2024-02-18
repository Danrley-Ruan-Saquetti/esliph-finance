import { Controller, Domain } from '@core'

@Controller({ prefix: '/payments', domain: Domain.CLIENT })
export class PaymentClientController {
    constructor() { }
}
