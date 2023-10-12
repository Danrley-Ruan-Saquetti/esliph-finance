import { HashEsliph, Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'
import jwt from 'jsonwebtoken'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'
import { Inversion } from '../../../../../core/injection'
import { Token } from '../../../../../services/token'

const AuthLoginSchema = z.object({
    login: z.string().trim().min(1, { message: 'O "Login" é obrigatório' }).default(''),
    password: z.string().trim().min(1, { message: 'A "Senha" é obrigatório' }).default(''),
})

export type AuthLoginArgs = z.input<typeof AuthLoginSchema>
export type AuthLoginResponse = { token: string }

@Inversion.Injectable('AuthLoginUseCase')
export class AuthLoginUseCase extends UseCase<AuthLoginResponse, AuthLoginArgs> {
    constructor(@Inversion.Inject('ListenerRepositoryClient') private readonly listenerRepository: ListenerRepositoryClient) {
        super()
    }

    async perform(args: AuthLoginArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthLoginSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { login, password } = argsValidate.getValue()

        const response = await this.listenerRepository.get('DB:accounts/find?login', { login })

        if (!response.isSuccess()) {
            throw new BadRequestException({ title: 'login de Autenticação', message: `Conta "${login}" não foi encontrada` })
        }

        const isValidPassword = await HashEsliph.compareHashWithRef(response.getValue().password, password)

        if (!isValidPassword) {
            throw new BadRequestException({ title: 'login de Autenticação', message: 'Senha inválida' })
        }

        const payloadBase = {
            sub: response.getValue().id,
            name: response.getValue().name,
            login: response.getValue().login,
        }

        const token = Token.sign(payloadBase)

        return Result.success<AuthLoginResponse>({ token: `${token}` })
    }
}
