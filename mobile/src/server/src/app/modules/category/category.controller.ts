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
        this.observer.post('categories/create', AuthorizationGuard, (req) => {
            return req.body
        })
    }
}
