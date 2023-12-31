import { Controller, Guard } from '@esliph/module'
import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get, Post } from '@services/http.service'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'
import { BankAccountQueryBalanceUseCase } from '@modules/bank-account/use-case/query-balance.use-case'

@Controller({ prefix: '/bank-accounts' })
export class BankAccountController {
    constructor(
        @Injection.Inject('bank-account.use-case.create') private createUC: BankAccountCreateUseCase,
        @Injection.Inject('bank-account.use-case.query') private queryUC: BankAccountQueryUseCase,
        @Injection.Inject('bank-account.use-case.query') private queryBalanceUC: BankAccountQueryBalanceUseCase,
    ) { }

    @Guard({ name: 'user.authorization' })
    @Get('')
    async get(req: Request) {
        const { userId } = req.headers

        const result = await this.queryUC.queryManyByUserIdWithoutPasswordAndBalance({ userId })

        return result
    }

    @Guard({ name: 'user.authorization' })
    @Post('/create')
    async create(req: Request) {
        const { userId } = req.headers
        const { name, password } = req.body

        const result = await this.createUC.perform({ name, password, userId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/current')
    async getCurrent(req: Request) {
        const id = req.headers['bankAccountId']

        const result = await this.queryUC.queryByIdWithoutPassword({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/balance')
    async getBalance(req: Request) {
        const bankAccountId = req.headers['bankAccountId']
        const dateStart = req.params['dateStart']
        const dateEnd = req.params['dateEnd']

        const result = await this.queryBalanceUC.perform({ bankAccountId, dateEnd, dateStart })

        return result
    }
}
