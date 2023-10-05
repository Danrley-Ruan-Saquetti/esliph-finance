import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthenticationService } from './authentication.service'

export class AuthenticationController extends Controller {
    protected readonly observer: ListenerPublicServer
    private readonly service: AuthenticationService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.service = new AuthenticationService()
    }

    initComponents() {
        this.observer.post('authentication/login', async (req, res) => {
            const response = await this.service.login(req.body)

            this.response(response, res)
        })
    }
}
