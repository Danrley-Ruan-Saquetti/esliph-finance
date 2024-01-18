import { Module } from '@core'
import { AddressController } from '@modules/address/address.controller'
import { AddressRepository } from '@modules/address/address.repository'
import { AddressUseCaseModule } from '@modules/address/use-case/use-case.module'

@Module({
    imports: [AddressUseCaseModule],
    controllers: [AddressController],
    providers: [AddressRepository],
})
export class AddressModule { }
