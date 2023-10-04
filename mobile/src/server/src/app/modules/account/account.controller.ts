import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'

export class AccountController extends Controller {
    protected readonly observer: ListenerPublicServer
    private readonly service: AccountService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.service = new AccountService()
    }

    initComponents() {
        this.observer.post('accounts/create', async (req, res) => {
            const response = await this.service.create(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            res.send(response.getValue())
        })

        this.observer.get('accounts/find?id', async (req, res) => {
            const response = await this.service.queryById(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            res.send(response.getValue())
        })

        this.observer.get('accounts/find?login', async (req, res) => {
            const response = await this.service.queryByLogin(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            res.send(response.getValue())
        })

        this.observer.get('accounts/find-all', async (req, res) => {
            const response = await this.service.queryAll()

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            res.send(response.getValue())
        })
    }
}
