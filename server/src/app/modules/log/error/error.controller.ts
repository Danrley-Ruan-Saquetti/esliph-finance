import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/log/errors', domain: Domain.ADMIN })
export class LogErrorController {
    constructor() { }

}
