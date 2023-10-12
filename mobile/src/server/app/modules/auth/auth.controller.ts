import { ListenerPrivateServer, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AuthService } from './auth.service'
import { Inversion } from '../../../core/injection'

export class AuthController extends Controller {
    constructor(
        @Inversion.Inject('AuthService') private readonly service: AuthService,
        @Inversion.Inject('ListenerPublicServer') private readonly listener: ListenerPublicServer,
        @Inversion.Inject('ListenerPrivateServer') private readonly listenerPrivate: ListenerPrivateServer,
    ) {
        super()
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
