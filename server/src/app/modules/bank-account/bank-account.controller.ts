import { Controller, Guard } from '@esliph/module'
import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get, Post } from '@services/http.service'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'

@Controller()
export class BankAccountController {
    constructor(
        @Injection.Inject('bank-account.use-case.create') private createUC: BankAccountCreateUseCase,
        @Injection.Inject('bank-account.use-case.query') private queryUC: BankAccountQueryUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/bank-accounts')
    async get(req: Request) {
        const { userId } = req.headers

        const result = await this.queryUC.queryManyByIdUserWithoutPassword({ userId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/bank-accounts/:id')
    async getOne(req: Request) {
        const { id } = req.params

        const result = await this.queryUC.queryByIdWithoutPasswordWithMask({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/bank-accounts/create')
    async create(req: Request) {
        const { userId } = req.headers
        const { name, password } = req.body

        const result = await this.createUC.perform({ name, password, userId })

        return result
    }
}
