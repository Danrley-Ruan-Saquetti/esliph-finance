import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryService } from './category.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'

export class CategoryController extends Controller {
    private readonly service: CategoryService
    private readonly listener: ListenerPublicServer

    constructor() {
        super()

        this.service = new CategoryService()
        this.listener = new ListenerPublicServer()
    }

    initComponents() {
        this.listener.post('PU:categories/create', AuthorizationGuard.perform, async req => {
            const response = await this.service.create({ ...req.body, accountId: req.headers.account })

            return response
        })

        this.listener.get('PU:categories/find?id', AuthorizationGuard.perform, async req => {
            const response = await this.service.queryById({ id: req.body.id, accountId: req.headers.account })

            return response
        })

        this.listener.get('PU:categories/find?name', AuthorizationGuard.perform, async req => {
            const response = await this.service.queryByName({ name: req.body.name, accountId: req.headers.account })

            return response
        })

        this.listener.get('PU:categories/find-all', AuthorizationGuard.perform, async req => {
            const response = await this.service.queryAll({ accountId: req.headers.account })

            return response
        })

        this.listener.put('PU:categories/update', AuthorizationGuard.perform, async req => {
            const response = await this.service.update({ ...req.body, accountId: req.headers.account, categoryId: req.headers.categoryId })

            return response
        })
    }
}
