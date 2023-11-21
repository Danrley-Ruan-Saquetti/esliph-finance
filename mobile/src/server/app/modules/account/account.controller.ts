import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Get } from '@esliph/module'
import { AccountCreateUseCase, AccountCreateDTOArgs } from '@modules/account/use-case/create.use-case'

@Controller()
export class AccountController {
    constructor(@Injection.Inject('account.use-case.create') private createUC: AccountCreateUseCase) {}

    @Get('/accounts/create')
    async create(req: Request<AccountCreateDTOArgs>) {
        const result = await this.createUC.perform(req.body)

        return result
    }
}
