import { Controller } from '../../../common/controller'
import { AccountService } from './account.service'

export class AccountController extends Controller {
    private readonly service: AccountService

    constructor() {
        super()

        this.service = new AccountService()
    }

    initComponents() {
        this.observer.get('accounts/create', async (req, res) => {
            const response = await this.service.create(req.body)

            res.send(response)
        })
    }
}