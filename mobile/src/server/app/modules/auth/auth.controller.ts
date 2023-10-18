import { ListenerPrivateServer, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthService } from './auth.service'

export class AuthController extends Controller {
    private readonly service: AuthService
    private readonly listener: ListenerPublicServer
    private readonly listenerPrivate: ListenerPrivateServer

    constructor() {
        super()

        this.service = new AuthService()
        this.listener = new ListenerPublicServer()
        this.listenerPrivate = new ListenerPrivateServer()
    }

    initComponents() {
        this.listener.post('PU:auth/login', async (req, res) => {
            const response = await this.service.login(req.body)

            this.response(response, res)
        })

        this.listener.post('PU:auth/valid-authorization', async (req, res) => {
            const response = await this.service.authorization({ Authorization: req.headers.Authorization || '' })

            this.response(response, res)
        })

        this.listenerPrivate.post('PR:auth/authorization', async (req, res) => {
            const response = await this.service.authorization(req.body)

            this.response(response, res)
        })
    }
}
