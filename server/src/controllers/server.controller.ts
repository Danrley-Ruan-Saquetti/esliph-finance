import { Controller, CoreModule, Domain, Get, Injection, Result } from '@core'

@Controller({ prefix: '', domain: Domain.PUBLIC })
export class ServerController {
    constructor() { }

    @Get('/status')
    health() {
        return Result.success({ ok: true, date: new Date(Date.now()) })
    }
}
