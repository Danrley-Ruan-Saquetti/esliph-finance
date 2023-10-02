import { AccountCreateRepository } from '../../repository/create'

export type AccountCreateArgs = {
    name: string,
    login: string,
    password: string
}

export class AccountCreateUseCase {
    private readonly createRepository: AccountCreateRepository

    constructor() {
        this.createRepository = new AccountCreateRepository()
    }

    async perform(args: AccountCreateArgs) {
        const response = await this.createRepository.perform(args)

        return response
    }
}