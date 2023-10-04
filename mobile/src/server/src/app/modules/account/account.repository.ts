import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountCreateRepository } from './repository/create'
import { AccountQueryRepository } from './repository/query'

export class AccountRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer
    private readonly createRepository: AccountCreateRepository
    private readonly queryRepository: AccountQueryRepository

    constructor() {
        super()

        this.createRepository = new AccountCreateRepository()
        this.queryRepository = new AccountQueryRepository()
        this.observer = new ListenerRepositoryServer()
    }

    initComponents() {
        this.observer.post('accounts/create', async (req, res) => {
            const response = await this.createRepository.perform(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            return res.send(response.getValue())
        })

        this.observer.get('accounts/find?name', async (req, res) => {
            const response = await this.queryRepository.findByName(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            return res.send(response.getValue())
        })

        this.observer.get('accounts/find?login', async (req, res) => {
            const response = await this.queryRepository.findByLogin(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            return res.send(response.getValue())
        })

        this.observer.get('accounts/find?id', async (req, res) => {
            const response = await this.queryRepository.findById(req.body)

            res.status(response.getStatus())

            if (!response.isSuccess()) {
                return res.error(response.getError())
            }

            return res.send(response.getValue())
        })
    }
}
