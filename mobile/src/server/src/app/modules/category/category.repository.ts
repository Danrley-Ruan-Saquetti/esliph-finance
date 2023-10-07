import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryCreateRepository } from '../category/repository/create'

export class CategoryRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer
    private readonly create: CategoryCreateRepository

    constructor() {
        super()

        this.observer = new ListenerRepositoryServer()
        this.create = new CategoryCreateRepository()
    }

    initComponents() {
        this.observer.post('categories/create', async (args) => {
            const response = await this.create.perform(args.body)

            return response
        })
    }
}
