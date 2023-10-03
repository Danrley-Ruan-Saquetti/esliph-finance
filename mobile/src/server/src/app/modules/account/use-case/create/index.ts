import { HttpStatusCodes, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { AccountCreateRepository } from '../../repository/create'
import { AccountQueryRepository } from '../../repository/query'

const AccountCreateSchema = z.object({
    name: z.string().trim().min(3, { message: '"Name" need min 3 characters' }).nonempty({ message: '"Name" is required' }),
    login: z.string().trim().nonempty({ message: '"Login" is required' }),
    password: z.string().trim().nonempty({ message: '"Password" is required' }),
})

type AccountCreateArgs = z.output<typeof AccountCreateSchema>

export class AccountCreateUseCase {
    private readonly createRepository: AccountCreateRepository
    private readonly queryRepository: AccountQueryRepository

    constructor() {
        this.createRepository = new AccountCreateRepository()
        this.queryRepository = new AccountQueryRepository()
    }

    async perform(args: AccountCreateArgs) {
        const argsValidate = ZodValidateService.performParse(args, AccountCreateSchema)

        if (!argsValidate.isSuccess()) {
            throw Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { login, name, password } = argsValidate.getValue()

        const accountWithLogin = await this.queryRepository.findByLogin(login)

        if (accountWithLogin) {
            throw Result.failure({ title: 'Create Account', message: `Already exists account with login "${login}"` }, HttpStatusCodes.BAD_REQUEST)
        }

        const response = await this.createRepository.perform({ name, login, password })

        return response
    }
}
