import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'
import { GLOBAL_ADDRESS_DTO } from '@modules/address/address.global'
import { AddressModel } from '../address.model'

const SchemaString = ValidatorService.schema
    .coerce
    .string()
    .trim()

const schemaDTO = ValidatorService.schema.object({
    addresses: ValidatorService.schema.array(ValidatorService.schema.object({
        peopleId: GLOBAL_ADDRESS_DTO.people.id,
        zipCode: SchemaString,
        city: SchemaString,
        street: SchemaString,
        state: SchemaString,
        neighborhood: SchemaString,
        complement: SchemaString
            .optional(),
        type: ValidatorService.schema
            .enum(GLOBAL_ADDRESS_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_ADDRESS_DTO.type.messageEnumInvalid }) })
            .transform(val => val.toUpperCase()),
        reference: SchemaString
            .optional(),
        number: SchemaString
            .optional(),
    }))
        .optional()
        .default([])
})

export type AddressCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'address.use-case.create' })
export class AddressCreateUseCase extends UseCase {
    constructor(@Injection.Inject('address.repository') private addressRepository: AddressRepository) {
        super()
    }

    async perform(args: AddressCreateDTOArgs) {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.perform(args)
            await transaction.commit()
            return result
        } catch (err: any) {
            await transaction.rollback()
            throw err
        }
    }

    async performUC(args: AddressCreateDTOArgs) {
        const { addresses } = this.validateDTO(args, schemaDTO)

        await this.registerAddress(addresses as AddressModel.CreateArgs[])

        return Result.success({ message: 'Address registered successfully' })
    }

    private async registerAddress(addresses: AddressModel.CreateArgs[]) {
        const registerAddressResult = await this.addressRepository.createMany({ data: addresses })

        if (registerAddressResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerAddressResult.getError(),
            title: 'Register Address',
        })
    }
}
