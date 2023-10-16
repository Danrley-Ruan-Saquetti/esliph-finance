import { HashEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'
import { Inversion } from '../../../../../core/injection'

const AccountCreateSchema = z.object({
    name: z.string().trim().min(1, { message: 'O "Nome" é obrigatório' }).default(''),
    login: z.string().trim().min(1, { message: 'O "Login" é obrigatório' }).default(''),
    password: z
        .string()
        .trim()
        .min(1, { message: 'O "Password" é obrigatório' })
        .min(6, { message: 'A "Senha" precisa ter no mínimo 6 caracteres' })
        .default(''),
})

export type AccountCreateArgs = z.input<typeof AccountCreateSchema>
export type AccountCreateResponse = { message: string }

@Inversion.Injectable('AccountCreateUseCase')
export class AccountCreateUseCase extends UseCase<AccountCreateResponse, AccountCreateArgs> {
    private readonly listenerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.listenerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AccountCreateArgs) {
        const argsValidate = ZodValidateService.performParse(args, AccountCreateSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { login, name, password } = argsValidate.getValue()

        const accountWithLogin = await this.listenerRepository.get('DB:accounts/is-exists?login', { login })

        if (!accountWithLogin.isSuccess()) {
            throw new BadRequestException({ title: 'Criar Conta', message: 'Não foi possível validar seu login. Por favor, tente novamente mais tarde' })
        }

        if (accountWithLogin.getValue()) {
            throw new BadRequestException({ title: 'Criar Conta', message: `Já existe uma conta com o login "${login}". Por Favor, escolha outro login` })
        }

        const passwordHash = await HashEsliph.generateHash(password)

        const response = await this.listenerRepository.post('DB:accounts/create', { login, name, password: passwordHash })

        if (!response.isSuccess()) {
            throw new BadRequestException({ title: 'Registrar Conta', message: 'Não foi possível registrar a conta', causes: response.getError().causes })
        }

        return Result.success({ message: 'Conta criada com sucesso' })
    }
}
