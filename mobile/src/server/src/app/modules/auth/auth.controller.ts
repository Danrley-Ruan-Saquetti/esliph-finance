import { ListenerPrivateServer, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthService } from './auth.service'

export class AuthController extends Controller {
    protected readonly listener: ListenerPublicServer
    protected readonly listenerPrivate: ListenerPrivateServer
    private readonly service: AuthService

    constructor() {
        super()

        this.listener = new ListenerPublicServer()
        this.listenerPrivate = new ListenerPrivateServer()
        this.service = new AuthService()
    }

    initComponents() {
        this.listener.post('auth/login', async (req, res) => {
            const response = await this.service.login(req.body)

            this.response(response, res)
        })

        this.listener.post('auth/valid-authorization', async (req, res) => {
            const response = await this.service.authorization({ Authorization: req.headers.Authorization || '' })

            this.response(response, res)
        })

        this.listenerPrivate.post('auth/authorization', async (req, res) => {
            const response = await this.service.authorization(req.body)

            this.response(response, res)
        })
    }
}
