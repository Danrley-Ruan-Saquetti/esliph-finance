import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/mails', domain: Domain.CLIENT })
export class MailController {
    constructor() { }

}
