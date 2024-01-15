import { Module } from '@esliph/module'
import { BlankController } from '@modules/blank/blank.controller'
import { BlankRepository } from '@modules/blank/blank.repository'
import { BlankUseCaseModule } from '@modules/blank/use-case/use-case.module'

@Module({
    imports: [BlankUseCaseModule],
    controllers: [BlankController],
    providers: [BlankRepository],
})
export class BlankModule { }
