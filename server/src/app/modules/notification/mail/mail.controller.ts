import { Request } from '@esliph/http'
import { Get, Post, Put } from '@esliph/adapter-fastify'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'

@Controller({ prefix: '/mails' })
export class MailController {
    constructor() { }

}
