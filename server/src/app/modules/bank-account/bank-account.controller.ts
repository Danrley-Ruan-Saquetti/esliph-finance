import { Controller, Guard } from '@esliph/module'
import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Post } from '@esliph/adapter-fastify'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'

@Controller()
export class BankAccountController {
    constructor(@Injection.Inject('bank-account.use-case.create') private createUC: BankAccountCreateUseCase) {}

    @Guard({ name: 'bank-account.authorization' })
    @Post('/bank-accounts/create')
    async create(req: Request) {
        const { userId } = req.headers
        const { name, passwordMaster } = req.body

        const result = await this.createUC.perform({ name, passwordMaster, userId })

        return result
    }
}
