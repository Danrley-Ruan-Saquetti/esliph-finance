import { Request } from '@core'
import { Get, Post, Put } from '@esliph/adapter-fastify'
import { Injection } from '@core'
import { Controller, Guard } from '@core'

@Controller({ prefix: '/mails' })
export class MailController {
    constructor() { }

}
