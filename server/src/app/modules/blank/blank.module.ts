import { Module } from '@core'
import { BlankClientController } from '@modules/blank/blank.client.controller'
import { BlankAdminController } from '@modules/blank/blank.admin.controller'
import { BlankRepository } from '@modules/blank/blank.repository'
import { BlankUseCaseModule } from '@modules/blank/use-case/use-case.module'

@Module({
    imports: [BlankUseCaseModule],
    controllers: [BlankClientController, BlankAdminController],
    providers: [BlankRepository],
})
export class BlankModule { }
