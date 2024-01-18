import { Controller, Guard, HttpStatusCode } from '@esliph/module'
import { HttpStatusCodes, Request } from '@esliph/http'
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

    @Guard({ name: 'customer.authorization' })
    @Get('')
    async get(req: Request) {
        const { peopleId } = req.headers

        const result = await this.queryUC.queryManyByPeopleIdWithoutPasswordAndBalance({ peopleId })

        return result
    }

    @Guard({ name: 'customer.authorization' })
    @Post('')
    @HttpStatusCode(HttpStatusCodes.CREATED)
    async create(req: Request) {
        const { peopleId } = req.headers
        const { name, password } = req.body

        const result = await this.createUC.perform({ name, password, peopleId })

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
