import { Controller } from '../../../common/controller'

export const ACCOUNT_REPOSITORY_PREFIX = '@db:accounts/'

export class AccountRepository extends Controller {
    constructor() {
        super(ACCOUNT_REPOSITORY_PREFIX)
    }

    initComponents() { }
}