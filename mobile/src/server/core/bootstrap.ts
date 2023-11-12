// import { Get, Server, Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'

@Injection.Injectable('Service')
class Service {

}

@Injection.Injectable()
class Controller {
    service: Service

    constructor() {
        this.service = Injection.resolve('Service')
    }

    // @Get('/hello')
    // hello(req: Request) {
    //     return req.body
    // }
}

export function Bootstrap() {
    const controller = Injection.resolve(Controller)

    console.log(controller)

    // const server = new Server<any>()

    // server.get('/hello', { hello: 'Hello World' })
}
