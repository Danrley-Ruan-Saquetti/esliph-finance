import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'

export type AuthUserExistsDTOArgs = { userId: string }

@Service({ name: 'auth.user.use-case.exists' })
export class AuthUserExistsUseCase extends UseCase {
    constructor(@Injection.Inject('user.use-case.query') private queryUC: UserQueryUseCase) {
        super()
    }

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
