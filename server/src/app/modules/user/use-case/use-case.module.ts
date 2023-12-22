import { Module } from '@esliph/module'
import { UserCreateUseCase } from '@modules/user/use-case/create.use-case'
import { UserGenerateCodeUseCase } from '@modules/user/use-case/generate-code.use-case'

@Module({
    providers: [UserCreateUseCase, UserGenerateCodeUseCase],
})
export class UserUseCaseModule {}
