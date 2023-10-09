import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { AccountCreateRepository } from './repository/create'
import { AccountQueryRepository } from './repository/query'
import { AccountUpdateRepository } from './repository/update'
import { Inversion } from '../../../core/injection'

export class AccountRepository extends Controller {
    private readonly createRepository: AccountCreateRepository
    private readonly updateRepository: AccountUpdateRepository
    private readonly queryRepository: AccountQueryRepository

    constructor(@Inversion.Inject('ListenerRepositoryServer') private readonly listener: ListenerRepositoryServer) {
        super()

        this.createRepository = new AccountCreateRepository()
        this.updateRepository = new AccountUpdateRepository()
        this.queryRepository = new AccountQueryRepository()
    }

    initComponents() {
        this.listener.post('DB:accounts/create', async (req, res) => {
            const response = await this.createRepository.perform(req.body)

            this.response(response, res)
        })

        this.listener.get('DB:accounts/find?name', async (req, res) => {
            const response = await this.queryRepository.findByName(req.body)

            this.response(response, res)
        })

        this.listener.get('DB:accounts/find?login', async (req, res) => {
            const response = await this.queryRepository.findByLogin(req.body)

            this.response(response, res)
        })

        this.listener.get('DB:accounts/find?id', async (req, res) => {
            const response = await this.queryRepository.findById(req.body)

            this.response(response, res)
        })

        this.listener.get('DB:accounts/find-all', async (req, res) => {
            const response = await this.queryRepository.findAll()

            this.response(response, res)
        })

        this.listener.put('DB:accounts/update', async (req, res) => {
            const response = await this.updateRepository.perform(req.body)

            this.response(response, res)
        })
    }
}
