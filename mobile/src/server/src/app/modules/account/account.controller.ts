import { ListenerPrivateClient, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'

export class AccountController extends Controller {
    protected readonly observer: ListenerPublicServer
    protected readonly observerPrivate: ListenerPrivateClient
    private readonly service: AccountService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.observerPrivate = new ListenerPrivateClient()
        this.service = new AccountService()
    }

    initComponents() {
        this.observer.post('accounts/create', async (req, res) => {
            const response = await this.service.create(req.body)

            this.response(response, res)
        })

        this.observer.get('accounts/find?id', async (req, res) => {
            const response = await this.service.queryById(req.body)

            this.response(response, res)
        })

        this.observer.get('accounts/find?login', async (req, res) => {
            const response = await this.service.queryByLogin(req.body)

            this.response(response, res)
        })

        this.observer.get('accounts/find-all', async (req, res) => {
            const response = await this.service.queryAll()

            this.response(response, res)
        })
    }
}
