import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'

export class AuthenticationRepository extends Controller {
    protected readonly observer: ListenerRepositoryServer

    constructor() {
        super()

        this.observer = new ListenerRepositoryServer()
    }

    initComponents() { }
}
