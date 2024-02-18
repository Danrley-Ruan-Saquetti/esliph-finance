import { Module } from '@core'
import { AddressClientController } from '@modules/address/address.client.controller'
import { AddressAdminController } from '@modules/address/address.admin.controller'
import { AddressRepository } from '@modules/address/address.repository'
import { AddressUseCaseModule } from '@modules/address/use-case/use-case.module'

@Module({
    imports: [AddressUseCaseModule],
    controllers: [AddressClientController, AddressAdminController],
    providers: [AddressRepository],
})
export class AddressModule { }
