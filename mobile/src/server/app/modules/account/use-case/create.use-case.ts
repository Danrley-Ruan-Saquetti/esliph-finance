import { Service } from '@esliph/module'

export type AccountCreateDTOArgs = {}

@Service({ name: 'account.use-case.create' })
export class AccountCreateUseCase {
    async perform(args: AccountCreateDTOArgs) {

    }
}
