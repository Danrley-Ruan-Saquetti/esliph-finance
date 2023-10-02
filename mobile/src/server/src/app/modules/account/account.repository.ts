import { EVENT_CONTEXT } from 'src/server/src/services/http/events'
import { Controller } from '../../../common/controller'

export const ACCOUNT_REPOSITORY_PREFIX = '@db:accounts/'

export class AccountRepository extends Controller {
    constructor() {
        super({ prefix: ACCOUNT_REPOSITORY_PREFIX, context: EVENT_CONTEXT.DATABASE })
    }

    initComponents() {}
}
