import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryCreateRepository } from '../category/repository/create'
import { CategoryQueryRepository } from './repository/query'
import { CategoryUpdateRepository } from './repository/update'

export class CategoryRepository extends Controller {
    protected readonly listener: ListenerRepositoryServer
    private readonly create: CategoryCreateRepository
    private readonly update: CategoryUpdateRepository
    private readonly query: CategoryQueryRepository

    constructor() {
        super()

        this.listener = new ListenerRepositoryServer()
        this.create = new CategoryCreateRepository()
        this.query = new CategoryQueryRepository()
        this.update = new CategoryUpdateRepository()
    }

    initComponents() {
        this.listener.post('DB:categories/create', async (args) => {
            const response = await this.create.perform(args.body)

            return response
        })

        this.listener.get('DB:categories/find?id', async (args) => {
            const response = await this.query.findById(args.body)

            return response
        })

        this.listener.get('DB:categories/find?name', async (args) => {
            const response = await this.query.findByName(args.body)

            return response
        })

        this.listener.get('DB:categories/find-all', async (args) => {
            const response = await this.query.findAll(args.body)

            return response
        })

        this.listener.put('DB:categories/update', async (args) => {
            const response = await this.update.perform(args.body)

            return response
        })
    }
}
