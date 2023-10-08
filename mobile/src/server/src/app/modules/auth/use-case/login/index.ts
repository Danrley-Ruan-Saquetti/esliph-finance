import { HashEsliph, Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'
import jwt from 'jsonwebtoken'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'

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
            throw new BadRequestException(argsValidate.getError())
        }

        const { login, password } = argsValidate.getValue()

        const response = await this.observerRepository.get('accounts/find?login', { login })

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

        const token = jwt.sign(payloadBase, 'safdfgd dg dfgefra', {
            expiresIn: '24h',
        })

        return Result.success<AuthLoginResponse>({ token: `${token}` })
    }
}
