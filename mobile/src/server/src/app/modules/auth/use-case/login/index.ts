import { HashEsliph, Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'

const AuthLoginSchema = z.object({
    login: z.string().trim().min(1, { message: '"Login" é obrigatório' }).default(''),
    password: z.string().trim().min(1, { message: '"Password" é obrigatório' }).default(''),
})

export type AuthLoginArgs = z.output<typeof AuthLoginSchema>
export type AuthLoginResponse = { token: string }

export class AuthLoginUseCase extends UseCase<AuthLoginResponse, AuthLoginArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AuthLoginArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthLoginSchema)

        if (!argsValidate.isSuccess()) {
            return Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { login, password } = argsValidate.getValue()

        const response = await this.observerRepository.get('accounts/find?login', { login })

        if (!response.isSuccess()) {
            return Result.failure({ title: 'login de Autenticação', message: `Conta "${login}" não foi encontrada` }, response.getStatus())
        }

        const isValidPassword = await HashEsliph.compareHashWithRef(response.getValue().password, password)

        if (!isValidPassword) {
            return Result.failure({ title: 'login de Autenticação', message: 'Senha inválida' })
        }

        return Result.success<AuthLoginResponse>({ token: 'BEARER' })
    }
}