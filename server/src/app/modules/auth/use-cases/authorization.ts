import { GenericObject } from '@util/types'
import { JWTService } from '@services/jwt'
import { z, Validator } from '@services/validator'

const schemaAuthorization = z.object({
    token: z.string()
})

export type AuthorizationDTOArgs = z.input<typeof schemaAuthorization>

export function authorization<PayloadBody extends GenericObject = {}>(args: AuthorizationDTOArgs, jwtService: JWTService<PayloadBody>) {
    const { token } = Validator.parseNoSafe(args, schemaAuthorization)

    return jwtService.valid(token)
}