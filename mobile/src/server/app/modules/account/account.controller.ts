import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Get, Post } from '@esliph/module'
import { ID } from '@server/@types'
import { AccountCreateUseCase, AccountCreateDTOArgs } from '@modules/account/use-case/create.use-case'
import { AccountQueryUseCase } from '@modules/account/use-case/query.use-case'

@Controller()
export class AccountController {
    constructor(
        @Injection.Inject('account.use-case.create') private createUC: AccountCreateUseCase,
        @Injection.Inject('account.use-case.query') private queryUC: AccountQueryUseCase,
    ) {}

    @Get('/accounts')
    async list() {
        const result = await this.queryUC.queryManyWithoutPassword()

        return result
    }

    @Get('/accounts/:id')
    async findById(req: Request<{ id: ID }>) {
        const result = await this.queryUC.queryByIdWithoutPassword(req.body)

        return result
    }

    @Post('/accounts/create')
    async create(req: Request<AccountCreateDTOArgs>) {
        const result = await this.createUC.perform(req.body)

        return result
    }
}
