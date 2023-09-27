import { AccountQueryRepositoryAbstract } from './query.repository'

export class AccountQueryService {
    constructor(private repository: AccountQueryRepositoryAbstract) {}

    perform() {
        return this.repository.perform()
    }
}
