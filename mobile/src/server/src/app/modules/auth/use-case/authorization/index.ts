import { Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'

const AuthAuthorizationSchema = z.object({
    Authorization: z.string().optional().default('')
})

export type AuthAuthorizationArgs = z.output<typeof AuthAuthorizationSchema>
export type AuthAuthorizationResponse = {}

export class AuthAuthorizationUseCase extends UseCase<AuthAuthorizationResponse, AuthAuthorizationArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()

        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AuthAuthorizationArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthAuthorizationSchema)

        if (!argsValidate.isSuccess()) {
            return Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { Authorization } = argsValidate.getValue()

        console.log(Authorization)

        return Result.success<AuthAuthorizationResponse>({})
    }
}
