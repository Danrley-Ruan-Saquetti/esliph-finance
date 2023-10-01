import { Controller } from '../../../common/controller'

export class AccountController extends Controller {
    constructor() {
        super('accounts/')
    }

    initComponents() {
        console.log('!')
    }
}