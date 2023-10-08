import { ListenerPrivateClient, ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryService } from './category.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'

export class CategoryController extends Controller {
    protected readonly observer: ListenerPublicServer
    protected readonly observerPrivate: ListenerPrivateClient
    private readonly service: CategoryService

    constructor() {
        super()

        this.observer = new ListenerPublicServer()
        this.observerPrivate = new ListenerPrivateClient()
        this.service = new CategoryService()
    }

    initComponents() {
        this.observer.post('categories/create', AuthorizationGuard, async (req) => {
            const response = await this.service.create({ ...req.body, accountId: req.headers.account })

            return response
        })

        this.observer.get('categories/find?id', AuthorizationGuard, async (req) => {
            const response = await this.service.queryById({ id: req.body.id, accountId: req.headers.account })

            return response
        })

        this.observer.get('categories/find?name', AuthorizationGuard, async (req) => {
            const response = await this.service.queryByName({ name: req.body.name, accountId: req.headers.account })

            return response
        })

        this.observer.get('categories/find-all', AuthorizationGuard, async (req) => {
            const response = await this.service.queryAll({ accountId: req.headers.account })

            return response
        })
    }
}
