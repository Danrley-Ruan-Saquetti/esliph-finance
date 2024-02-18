import { Request, Get, Post, Put, Injection, Controller, Guard, Domain, Delete } from '@core'

@Controller({ prefix: '/addresses', domain: Domain.ADMIN })
export class AddressAdminController {
    constructor(
    ) { }
}
