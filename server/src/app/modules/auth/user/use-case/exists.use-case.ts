import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'
import { Result } from '@esliph/common'

export type AuthUserExistsDTOArgs = { userId: string }

@Service({ name: 'auth.user.use-case.exists' })
export class AuthUserExistsUseCase extends UseCase {
    constructor(@Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase) {
        super()
    }

    async perform({ userId }: AuthUserExistsDTOArgs) {
        const userResult = await this.queryUC.queryByIdWithoutPassword({ id: Number(userId) })

        return Result.success({ ok: userResult.isSuccess() })
    }
}
