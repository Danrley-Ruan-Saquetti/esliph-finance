import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'

export class CategoryRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer

    constructor() {
        super()

        this.observer = new ListenerRepositoryServer()
    }

    initComponents() {
    }
}
