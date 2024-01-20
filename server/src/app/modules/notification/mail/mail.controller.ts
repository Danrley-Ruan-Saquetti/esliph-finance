import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/mails', domain: Domain.CUSTOMER })
export class MailController {
    constructor() { }

}
