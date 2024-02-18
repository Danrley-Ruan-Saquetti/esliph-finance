import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'
import { GLOBAL_ADDRESS_DTO } from '@modules/address/address.global'

const schemaDTO = SchemaValidator.object({
    peopleId: GLOBAL_ADDRESS_DTO.people.id,
    id: GLOBAL_ADDRESS_DTO.id,
})

export type AddressRemoveDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'address.use-case.remove' })
export class AddressRemoveUseCase extends UseCase {
    constructor(@Injection.Inject('address.repository') private addressRepository: AddressRepository) {
        super()
    }

    async perform(args: AddressRemoveDTOArgs) {
        const { id, peopleId } = this.validateDTO(args, schemaDTO)

        await this.isExistsAddress({ id, peopleId })
        await this.removeAddress({ id, peopleId })

        return Result.success({ message: 'Address removed successfully' })
    }

    async isExistsAddress({ id, peopleId }: { id: ID, peopleId: ID }) {
        const removeResult = await this.addressRepository.findUnique({ where: { id, peopleId } })

        if (removeResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...removeResult.getError(), title: 'Query Address' })
    }

    private async removeAddress({ id, peopleId }: { id: ID, peopleId: ID }) {
        const removeResult = await this.addressRepository.delete({ where: { id, peopleId } })

        if (removeResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...removeResult.getError(), title: 'Remove Address' })
    }
}
