import { Controller, Domain } from '@core'

@Controller({ prefix: '/auth', domain: Domain.CUSTOMER })
export class AuthController {
    constructor() { }
}
