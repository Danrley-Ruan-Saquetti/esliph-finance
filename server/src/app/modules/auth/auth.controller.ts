import { Controller, Domain } from '@core'

@Controller({ prefix: '/auth', domain: Domain.CLIENT })
export class AuthController {
    constructor() { }
}
