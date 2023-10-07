import { Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { UnauthorizedException } from '../../../../../common/exception'
import jwt from 'jsonwebtoken'

const AuthAuthorizationSchema = z.object({
    Authorization: z.string().optional().default('')
})

export type AuthAuthorizationArgs = z.output<typeof AuthAuthorizationSchema>
export type AuthAuthorizationResponse = {}

export class AuthAuthorizationUseCase extends UseCase<AuthAuthorizationResponse, AuthAuthorizationArgs> {

    constructor() {
        super()
    }

    async perform(args: AuthAuthorizationArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthAuthorizationSchema)

        if (!argsValidate.isSuccess()) {
            return Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { Authorization } = argsValidate.getValue()

        if (!Authorization) {
            throw new UnauthorizedException({ description: 'Você deve fornecedor um token de autorização' })
        }

        if (Authorization.split(' ').length != 2) {
            throw new UnauthorizedException({ description: 'Formato do Token de autorização inválido' })
        }

        const [bearer, token] = Authorization.split(' ')

        if (bearer !== 'Bearer') {
            throw new UnauthorizedException({ description: 'Formato do Token de autorização inválido' })
        }

        try {
            jwt.verify(token, 'safdfgd dg dfgefra')
        } catch (err) {
            throw new UnauthorizedException({ description: 'Token de autorização inválido' })
        }

        return Result.success<AuthAuthorizationResponse>({})
    }
}
