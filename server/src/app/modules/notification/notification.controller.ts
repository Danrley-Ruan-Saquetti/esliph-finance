import { Request, Get, Post, Put, Injection, Controller, Guard, Domain } from '@core'

@Controller({ prefix: '/notifications', domain: Domain.CUSTOMER })
export class NotificationController {
    constructor() { }

}
