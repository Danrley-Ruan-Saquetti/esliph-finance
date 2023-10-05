import { Result } from '@esliph/util-node'
import { UseCase } from '../../../../../common/use-case'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { ZodValidateService } from '../../../../../services/formatter'

const AuthAuthenticationSchema = z.object({})

export type AuthAuthenticationArgs = z.output<typeof AuthAuthenticationSchema>
export type AuthAuthenticationResponse = {}

export class AuthAuthenticationUseCase extends UseCase<AuthAuthenticationResponse, AuthAuthenticationArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()

        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AuthAuthenticationArgs) {
        const argsValidate = ZodValidateService.performParse(args, AuthAuthenticationSchema)

        if (!argsValidate.isSuccess()) {
            return Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        return Result.success<AuthAuthenticationResponse>({})
    }
}
