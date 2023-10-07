import { ListenerPrivateServer, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthService } from './auth.service'

export class AuthController extends Controller {
    protected readonly observer: ListenerPublicServer
    protected readonly observerPrivate: ListenerPrivateServer
    private readonly service: AuthService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.observerPrivate = new ListenerPrivateServer()
        this.service = new AuthService()
    }

    initComponents() {
        this.observer.post('auth/login', async (req, res) => {
            const response = await this.service.login(req.body)

            this.response(response, res)
        })

        this.observer.post('auth/valid-authorization', async (req, res) => {
            const response = await this.service.authorization({ Authorization: req.headers.Authorization || '' })

            this.response(response, res)
        })

        this.observerPrivate.post('auth/authorization', async (req, res) => {
            const response = await this.service.authorization(req.body)

            this.response(response, res)
        })
    }
}
