import { HttpStatusCodes, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { AccountQueryRepository } from '../../repository/query'
import { ListenerRepositoryClient } from '../../../../../services/http'

const AccountCreateSchema = z.object({
    name: z.string().trim().nonempty({ message: '"Nome" é obrigatório' }).default(''),
    login: z.string().trim().nonempty({ message: '"Login" é obrigatório' }).default(''),
    password: z
        .string()
        .trim()
        .nonempty({ message: '"Password" é obrigatório' })
        .min(6, { message: 'A "Senha" precisa ter no mínimo 6 caracteres' })
        .default(''),
})

export type AccountCreateArgs = z.output<typeof AccountCreateSchema>
export type AccountCreateResponse = Result<{ message: string }>

export class AccountCreateUseCase {
    private readonly queryRepository: AccountQueryRepository
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        this.queryRepository = new AccountQueryRepository()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AccountCreateArgs): Promise<AccountCreateResponse> {
        const argsValidate = ZodValidateService.performParse(args, AccountCreateSchema)

        if (!argsValidate.isSuccess()) {
            throw Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { login, name, password } = argsValidate.getValue()

        const accountWithLogin = await this.queryRepository.findByLogin(login)

        if (accountWithLogin) {
            throw Result.failure({ title: 'Criar Conta', message: `Já existe uma conta com o login "${login}"` }, HttpStatusCodes.BAD_REQUEST)
        }

        const response = await this.observerRepository.post('accounts/create', { login, name, password })

        if (!response.isSuccess()) {
            return Result.failure({ title: 'Registrar Conta', message: 'Não foi possível registrar a conta', causes: response.getError().causes })
        }

        return Result.success({ message: 'Conta criada com sucesso' })
    }
}
