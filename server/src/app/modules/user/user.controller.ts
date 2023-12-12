import { Get } from '@esliph/adapter-fastify'
import { Controller, Guard } from '@esliph/module'

@Controller()
export class UserController {
    constructor() { }

    @Guard({ name: 'user.authorization' })
    @Get('/hello')
    hello() {
        return { hello: 'world' }
    }
}
