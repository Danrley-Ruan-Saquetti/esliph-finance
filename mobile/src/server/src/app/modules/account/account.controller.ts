import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'

export const ACCOUNT_CONTROLLER_PREFIX = 'accounts'

export class AccountController extends Controller {
    private readonly service: AccountService

    constructor() {
        super(ACCOUNT_CONTROLLER_PREFIX)

        this.service = new AccountService()
    }

    initComponents() {
        this.observer.get('/hello', () => this.service.hello())
    }
}