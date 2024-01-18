import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { GLOBAL_DTO } from '@global'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'
import { GLOBAL_ADDRESS_DTO } from '@modules/address/address.global'
import { AddressModel } from '@modules/address/address.model'

const SchemaString = (name: string, isRequired = false) => ValidatorService.schema
    .coerce
    .string(isRequired ? { 'required_error': GLOBAL_DTO.required(name) } : {})
    .trim()

const schemaDTO = ValidatorService.schema.object({
    peopleId: GLOBAL_ADDRESS_DTO.people.id,
    addresses: ValidatorService.schema.array(ValidatorService.schema.object({
        zipCode: SchemaString('ZIP Code', true),
        city: SchemaString('City', true),
        street: SchemaString('Street', true),
        country: SchemaString('Country', true),
        state: SchemaString('State', true),
        neighborhood: SchemaString('Neighborhood', true),
        complement: SchemaString('Complement')
            .optional(),
        type: ValidatorService.schema
            .enum(GLOBAL_ADDRESS_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_ADDRESS_DTO.type.messageEnumInvalid }) })
            .default(GLOBAL_ADDRESS_DTO.type.default)
            .transform(val => val.toUpperCase()),
        reference: SchemaString('Reference')
            .optional(),
        number: SchemaString('Number')
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
        const { addresses, peopleId } = this.validateDTO(args, schemaDTO)

        await this.registerAddress(addresses.map(address => ({ ...address, type: address.type as AddressModel.Type, peopleId })))

        return Result.success({ message: 'Address registered successfully' })
    }

    private async registerAddress(addresses: AddressModel.CreateArgs[]) {
        const registerAddressResult = await this.addressRepository.createMany({
            data: addresses.map(({ city, country, neighborhood, peopleId, state, street, zipCode, complement, number, reference, type }) => ({
                city,
                country,
                neighborhood,
                peopleId,
                state,
                street,
                zipCode,
                complement,
                number,
                reference,
                type
            }))
        })

        if (registerAddressResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerAddressResult.getError(),
            title: 'Register Address',
        })
    }
}
