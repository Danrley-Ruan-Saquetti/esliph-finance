import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'
import { GLOBAL_ADDRESS_DTO } from '@modules/address/address.global'
import { AddressModel } from '@modules/address/address.model'

const SchemaString = ValidatorService.schema
    .coerce
    .string()
    .trim()
    .optional()

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_ADDRESS_DTO.id,
    peopleId: GLOBAL_ADDRESS_DTO.people.id,
    zipCode: SchemaString,
    city: SchemaString,
    street: SchemaString,
    state: SchemaString,
    neighborhood: SchemaString,
    complement: SchemaString,
    type: ValidatorService.schema
        .enum(GLOBAL_ADDRESS_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_ADDRESS_DTO.type.messageEnumInvalid }) })
        .optional()
        .transform(val => val ? val.toUpperCase() : undefined),
    reference: SchemaString,
    number: SchemaString,
})

export type AddressUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'address.use-case.update' })
export class AddressUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('address.repository') private addressRepository: AddressRepository) {
        super()
    }

    async perform(args: AddressUpdateDTOArgs) {
        const { id, peopleId, city, complement, neighborhood, number, reference, state, street, type, zipCode } = this.validateDTO(args, schemaDTO)

        await this.verifyIsExistsAddress({ id, peopleId })
        await this.update({ city, complement, neighborhood, number, reference, state, street, type: type as AddressModel.Type, zipCode }, { id, peopleId })

        return Result.success({ message: 'Address updated successfully' })
    }

    private async verifyIsExistsAddress({ id, peopleId }: { id: ID, peopleId: ID }) {
        const addressResult = await this.addressRepository.findUnique({ where: { id, peopleId } })

        if (addressResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...addressResult.getError(), title: 'Find Address' })
    }

    private async update(data: AddressModel.UpdateArgs, { id, peopleId }: { id: ID, peopleId: ID }) {
        const updateResult = await this.addressRepository.update({ data, where: { id, peopleId } })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...updateResult.getError(), title: 'Update Address' })
    }
}
