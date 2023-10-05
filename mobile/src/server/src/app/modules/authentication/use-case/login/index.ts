import { HashEsliph, Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'

const AuthenticationLoginSchema = z.object({
    login: z.string().trim().nonempty({ message: '"Login" é obrigatório' }).default(''),
    password: z
        .string()
        .trim()
        .nonempty({ message: '"Password" é obrigatório' })
        .default(''),
})

export type AuthenticationLoginArgs = z.output<typeof AuthenticationLoginSchema>
export type AuthenticationLoginResponse = { token: string }

export class AuthenticationLoginUseCase extends UseCase<AuthenticationLoginResponse, AuthenticationLoginArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AuthenticationLoginArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthenticationLoginSchema)

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

        return Result.success<AuthenticationLoginResponse>({ token: 'BEARER' })
    }
}