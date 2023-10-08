import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'

export class AuthRepository extends Controller {
    protected readonly listener: ListenerRepositoryServer

    constructor() {
        super()

        this.listener = new ListenerRepositoryServer()
    }

    initComponents() { }
}
