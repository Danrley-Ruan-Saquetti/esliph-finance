import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@esliph/adapter-fastify'

@Controller()
export class AuthController {
    constructor() {}

    @Post('/auth/sign-up')
    async signUp() {}
}
