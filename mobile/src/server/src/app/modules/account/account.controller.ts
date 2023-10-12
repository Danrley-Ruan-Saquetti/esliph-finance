import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'
import { Inversion } from '../../../core/injection'

export class AccountController extends Controller {
    constructor(
        @Inversion.Inject('AccountService') private readonly service: AccountService,
        @Inversion.Inject('ListenerPublicServer') private readonly listener: ListenerPublicServer,
    ) {
        super()
    }

    initComponents() {
        this.listener.post('PU:accounts/create', async (req, res) => {
            const response = await this.service.create(req.body)

            this.response(response, res)
        })

        this.listener.get('PU:accounts/find?id', async (req, res) => {
            const response = await this.service.queryById(req.body)

            this.response(response, res)
        })

        this.listener.get('PU:accounts/find?login', async (req, res) => {
            const response = await this.service.queryByLogin(req.body)

            this.response(response, res)
        })

        this.listener.get('PU:accounts/find-all', async (req, res) => {
            const response = await this.service.queryAll()

            this.response(response, res)
        })

        this.listener.put('PU:accounts/update', AuthorizationGuard.perform, async (req, res) => {
            const response = await this.service.update({ ...req.body, accountId: req.headers.account })

            this.response(response, res)
        })
    }
}
