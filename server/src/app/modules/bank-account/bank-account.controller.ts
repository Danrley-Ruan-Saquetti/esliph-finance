import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Get, Post } from '@esliph/module'
import { ID } from '@@types'
import { BankAccountCreateUseCase, BankAccountCreateDTOArgs } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'

@Controller()
export class BankAccountController {
    constructor(
        @Injection.Inject('account.use-case.create') private createUC: BankAccountCreateUseCase,
        @Injection.Inject('account.use-case.query') private queryUC: BankAccountQueryUseCase,
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
