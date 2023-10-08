import { ListenerPrivateClient, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'

export class AccountController extends Controller {
    protected readonly listener: ListenerPublicServer
    protected readonly listenerPrivate: ListenerPrivateClient
    private readonly service: AccountService

    constructor() {
        super()

        this.listener = new ListenerPublicServer()
        this.listenerPrivate = new ListenerPrivateClient()
        this.service = new AccountService()
    }

    initComponents() {
        this.listener.post('accounts/create', async (req, res) => {
            const response = await this.service.create(req.body)

            this.response(response, res)
        })

        this.listener.get('accounts/find?id', async (req, res) => {
            const response = await this.service.queryById(req.body)

            this.response(response, res)
        })

        this.listener.get('accounts/find?login', async (req, res) => {
            const response = await this.service.queryByLogin(req.body)

            this.response(response, res)
        })

        this.listener.get('accounts/find-all', async (req, res) => {
            const response = await this.service.queryAll()

            this.response(response, res)
        })
    }
}
