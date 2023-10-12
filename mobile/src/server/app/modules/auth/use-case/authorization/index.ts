import { Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { UnauthorizedException } from '../../../../../common/exception'
import { PayloadAuthorization } from '../../../../../@types/payload-authorization'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'
import { Inversion } from '../../../../../core/injection'
import { Token } from '../../../../../services/token'

const AuthAuthorizationSchema = z.object({
    Authorization: z.string().optional().default('')
})

export type AuthAuthorizationArgs = z.input<typeof AuthAuthorizationSchema>
export type AuthAuthorizationResponse = PayloadAuthorization

@Inversion.Injectable('AuthAuthorizationUseCase')
export class AuthAuthorizationUseCase extends UseCase<AuthAuthorizationResponse, AuthAuthorizationArgs> {
    constructor() {
        super()
    }

    async perform(args: AuthAuthorizationArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthAuthorizationSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
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

        const resultPayload = Token.verify(token)

        if (!resultPayload.isSuccess) {
            throw new UnauthorizedException(resultPayload.getError())
        }

        return Result.success<AuthAuthorizationResponse>(resultPayload.getValue())
    }
}
