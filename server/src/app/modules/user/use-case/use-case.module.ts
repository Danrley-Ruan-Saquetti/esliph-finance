import { Module } from '@esliph/module'
import { UserCreateUseCase } from '@modules/user/use-case/create.use-case';

@Module({
    providers: [UserCreateUseCase],
})
export class UserUseCaseModule {}
