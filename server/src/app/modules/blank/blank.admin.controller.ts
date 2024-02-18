import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/blanks', domain: Domain.ADMIN })
export class BlankAdminController {
    constructor() { }

}
