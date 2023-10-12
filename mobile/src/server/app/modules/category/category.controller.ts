import { ListenerPublicServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { CategoryService } from './category.service'
import { AuthorizationGuard } from '../auth/guards/authorization.guard'
import { Inversion } from '../../../core/injection'

export class CategoryController extends Controller {
    constructor(
        @Inversion.Inject('CategoryService') private readonly service: CategoryService,
        @Inversion.Inject('ListenerPublicServer') private readonly listener: ListenerPublicServer,
    ) {
        super()
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
