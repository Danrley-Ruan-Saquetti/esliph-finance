import { BadRequestException } from '@common/exceptions'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { PayloadJWTUserBankAccount } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'

export type AuthUserExistsDTOArgs = { userId: string }

@Service({ name: 'auth.user.use-case.exists' })
export class AuthUserExistsUseCase {
    constructor(@Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase) { }

    async perform({ userId }: AuthUserExistsDTOArgs) {
        try {
            const userResult = await this.queryUC.queryByIdWithoutPassword({ id: Number(userId) })

            if (userResult.isSuccess()) {
                return
            }

            throw new BadRequestException({ title: 'Find User', message: 'User not found' })
        } catch (err: any) {
            throw new BadRequestException({ title: 'Find User', message: 'Unable to find user' })
        }
    }
}
