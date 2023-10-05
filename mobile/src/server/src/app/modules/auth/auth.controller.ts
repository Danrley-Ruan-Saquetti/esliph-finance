import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthService } from './auth.service'

export class AuthController extends Controller {
    protected readonly observer: ListenerPublicServer
    private readonly service: AuthService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.service = new AuthService()
    }

    initComponents() {
        this.observer.post('auth/login', async (req, res) => {
            const response = await this.service.login(req.body)

            this.response(response, res)
        })
    }
}
