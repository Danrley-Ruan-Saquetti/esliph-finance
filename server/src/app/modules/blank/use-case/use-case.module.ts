import { Module } from '@core'
import { BlankCreateUseCase } from '@modules/blank/use-case/create.use-case'
import { BlankUpdateUseCase } from '@modules/blank/use-case/update.use-case'
import { BlankQueryUseCase } from '@modules/blank/use-case/query.use-case'

@Module({
    providers: [BlankCreateUseCase, BlankUpdateUseCase, BlankQueryUseCase],
})
export class BlankUseCaseModule { }
