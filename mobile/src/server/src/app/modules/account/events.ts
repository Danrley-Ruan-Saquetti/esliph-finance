import { AccountCreateArgs } from './use-case/create'

export type AccountPublicEvents = {
    'accounts/create': {
        body: AccountCreateArgs
        response: any
    }
}
export type AccountDatabaseEvents = {}
