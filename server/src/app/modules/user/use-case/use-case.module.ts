import { Module } from '@core'
import { UserCreateUseCase } from '@modules/user/use-case/create.use-case'
import { UserGenerateCodeUseCase } from '@modules/user/use-case/generate-code.use-case'
import { UserQueryUseCase } from '@modules/user/use-case/query.use-case'
import { UserUpdateUseCase } from '@modules/user/use-case/update.use-case'

@Module({
    providers: [UserCreateUseCase, UserGenerateCodeUseCase, UserQueryUseCase, UserUpdateUseCase],
})
export class UserUseCaseModule { }
