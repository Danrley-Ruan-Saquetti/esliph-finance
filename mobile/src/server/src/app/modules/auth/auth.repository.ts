import { ListenerRepositoryServer } from '../../../services/http'
import { Controller } from '../../../common/controller'
import { Inversion } from '../../../core/injection'

export class AuthRepository extends Controller {
    constructor(@Inversion.Inject('ListenerRepositoryServer') private readonly listener: ListenerRepositoryServer) {
        super()
    }

    initComponents() {}
}
