import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'address.use-case.query' })
export class AddressQueryUseCase extends UseCase {
    constructor(@Injection.Inject('address.repository') private addressRepository: AddressRepository) {
        super()
    }

    async queryById({ id }: { id: ID }) {
        id = this.validateDTO(id, schemaNumber)

        const addressResult = await this.addressRepository.findUnique({ where: { id } })

        if (!addressResult.isSuccess()) {
            return Result.failure({ ...addressResult.getError(), title: 'Query Address' })
        }

        return Result.success(addressResult.getValue() || [])
    }

    async queryByIdAndPeopleId({ id, peopleId }: { id: ID, peopleId: ID }) {
        peopleId = this.validateDTO(peopleId, schemaNumber)
        id = this.validateDTO(id, schemaNumber)

        const addressResult = await this.addressRepository.findUnique({ where: { id, peopleId } })

        if (!addressResult.isSuccess()) {
            return Result.failure({ ...addressResult.getError(), title: 'Query Address' })
        }

        return Result.success(addressResult.getValue() || [])
    }

    async queryManyByPeopleId({ peopleId }: { peopleId: ID }) {
        peopleId = this.validateDTO(peopleId, schemaNumber)

        const addressesResult = await this.addressRepository.findMany({ where: { peopleId } })

        if (!addressesResult.isSuccess()) {
            return Result.failure({ ...addressesResult.getError(), title: 'Query Addresses' })
        }

        return Result.success(addressesResult.getValue())
    }
}
