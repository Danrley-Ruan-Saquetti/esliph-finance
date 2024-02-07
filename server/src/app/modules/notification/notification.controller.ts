import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/notifications', domain: Domain.CLIENT })
export class NotificationController {
    constructor() { }

}
