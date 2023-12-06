import { Module } from '@esliph/module'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'

@Module({
    providers: [AuthSignInUseCase],
})
export class AuthUseCaseModule { }
