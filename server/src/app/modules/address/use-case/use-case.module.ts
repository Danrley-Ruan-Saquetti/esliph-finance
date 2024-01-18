import { Module } from '@core'
import { AddressCreateUseCase } from '@modules/address/use-case/create.use-case'
import { AddressUpdateUseCase } from '@modules/address/use-case/update.use-case'
import { AddressQueryUseCase } from '@modules/address/use-case/query.use-case'

@Module({
    providers: [AddressCreateUseCase, AddressUpdateUseCase, AddressQueryUseCase],
})
export class AddressUseCaseModule { }
