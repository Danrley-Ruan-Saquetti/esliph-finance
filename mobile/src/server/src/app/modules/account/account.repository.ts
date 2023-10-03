import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountCreateRepository } from './repository/create'

export class AccountRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer
    private readonly createRepository: AccountCreateRepository

    constructor() {
        super()

        this.createRepository = new AccountCreateRepository()
        this.observer = new ListenerRepositoryServer()
    }

    initComponents() {
        this.observer.post('accounts/create', async (req, res) => {
            const response = await this.createRepository.perform(req.body)

            if (!response.isSuccess()) {
                return res.status(response.getStatus()).error(response.getError())
            }

            return res.send(response.getValue())
        })
    }
}
