import { Controller, Guard } from '@esliph/module'
import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get, Post } from '@services/http.service'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'

@Controller({ prefix: '/bank-accounts' })
export class BankAccountController {
    constructor(
        @Injection.Inject('bank-account.use-case.create') private createUC: BankAccountCreateUseCase,
        @Injection.Inject('bank-account.use-case.query') private queryUC: BankAccountQueryUseCase,
    ) { }

    @Guard({ name: 'user.authorization' })
    @Get('')
    async get(req: Request) {
        const { userId } = req.headers

        const result = await this.queryUC.queryManyByIdUserWithoutPasswordAndBalance({ userId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const { userId } = req.headers
        const { name, password } = req.body

        const result = await this.createUC.perform({ name, password, userId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/current')
    async getOne(req: Request) {
        const id = req.headers['bankAccountId']

        const result = await this.queryUC.queryByIdCodeMaskWithoutPasswordWhitMask({ id })

        console.log(result)

        return result
    }
}
