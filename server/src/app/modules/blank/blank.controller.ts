import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/blanks', domain: Domain.CUSTOMER })
export class BlankController {
    constructor() { }

}
