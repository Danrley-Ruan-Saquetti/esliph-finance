import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryCreateRepository } from '../category/repository/create'
import { CategoryQueryRepository } from './repository/query'

export class CategoryRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer
    private readonly create: CategoryCreateRepository
    private readonly query: CategoryQueryRepository

    constructor() {
        super()

        this.observer = new ListenerRepositoryServer()
        this.create = new CategoryCreateRepository()
        this.query = new CategoryQueryRepository()
    }

    initComponents() {
        this.observer.post('categories/create', async (args) => {
            const response = await this.create.perform(args.body)

            return response
        })

        this.observer.get('categories/find?id', async (args) => {
            const response = await this.query.findById(args.body)

            return response
        })

        this.observer.get('categories/find?name', async (args) => {
            const response = await this.query.findByName(args.body)

            return response
        })

        this.observer.get('categories/find-all', async (args) => {
            const response = await this.query.findAll(args.body)

            return response
        })
    }
}
