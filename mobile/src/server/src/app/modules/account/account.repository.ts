import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountCreateRepository } from './repository/create'
import { AccountQueryRepository } from './repository/query'
import { AccountUpdateRepository } from './repository/update'

export class AccountRepository extends Controller {
    protected readonly listener: ListenerRepositoryServer
    private readonly createRepository: AccountCreateRepository
    private readonly updateRepository: AccountUpdateRepository
    private readonly queryRepository: AccountQueryRepository

    constructor() {
        super()

        this.createRepository = new AccountCreateRepository()
        this.updateRepository = new AccountUpdateRepository()
        this.queryRepository = new AccountQueryRepository()
        this.listener = new ListenerRepositoryServer()
    }

    initComponents() {
        this.listener.post('db:accounts/create', async (req, res) => {
            const response = await this.createRepository.perform(req.body)

            this.response(response, res)
        })

        this.listener.get('db:accounts/find?name', async (req, res) => {
            const response = await this.queryRepository.findByName(req.body)

            this.response(response, res)
        })

        this.listener.get('db:accounts/find?login', async (req, res) => {
            const response = await this.queryRepository.findByLogin(req.body)

            this.response(response, res)
        })

        this.listener.get('db:accounts/find?id', async (req, res) => {
            const response = await this.queryRepository.findById(req.body)

            this.response(response, res)
        })

        this.listener.get('db:accounts/find-all', async (req, res) => {
            const response = await this.queryRepository.findAll()

            this.response(response, res)
        })

        this.listener.put('db:accounts/update', async (req, res) => {
            const response = await this.updateRepository.perform(req.body)

            this.response(response, res)
        })
    }
}
