import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { AddressRepository } from '@modules/address/address.repository'
import { GLOBAL_ADDRESS_DTO } from '@modules/address/address.global'
import { AddressModel } from '@modules/address/address.model'

const schemaDTO = SchemaValidator.object({
    peopleId: GLOBAL_ADDRESS_DTO.people.id,
    addresses: SchemaValidator.array(SchemaValidator.object({
        zipCode: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.zipCode.messageRequired })
            .regex(GLOBAL_ADDRESS_DTO.zipCode.regex, { message: GLOBAL_ADDRESS_DTO.zipCode.messageInvalid })
            .trim(),
        city: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.city.messageRequired })
            .trim(),
        street: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.street.messageRequired })
            .trim(),
        country: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.country.messageRequired })
            .trim(),
        state: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.state.messageRequired })
            .trim(),
        neighborhood: SchemaValidator
            .string({ 'required_error': GLOBAL_ADDRESS_DTO.neighborhood.messageRequired })
            .trim(),
        complement: SchemaValidator
            .string()
            .trim()
            .optional(),
        type: SchemaValidator
            .enum(GLOBAL_ADDRESS_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_ADDRESS_DTO.type.messageEnumInvalid }) })
            .default(GLOBAL_ADDRESS_DTO.type.default)
            .transform(val => val.toUpperCase()),
        reference: SchemaValidator
            .string()
            .trim()
            .optional(),
        number: SchemaValidator
            .string()
            .trim()
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
            const result = await this.performUC(args)
            await transaction.commit()
            return result
        } catch (err: any) {
            await transaction.rollback()
            throw err
        }
    }

    async performUC(args: AddressCreateDTOArgs) {
        const { addresses, peopleId } = this.validateDTO(args, schemaDTO)

        await this.registerAddress(addresses.map(address => ({
            ...address,
            type: address.type as AddressModel.Type,
            peopleId
        })))

        return Result.success({ message: 'Address registered successfully' })
    }

    private async registerAddress(addresses: AddressModel.CreateArgs[]) {
        const registerAddressResult = await this.addressRepository.createMany({
            data: addresses.map(address => ({
                city: address.city,
                country: address.country,
                neighborhood: address.neighborhood,
                state: address.state,
                street: address.street,
                zipCode: address.zipCode,
                complement: address.complement,
                number: address.number,
                reference: address.reference,
                type: address.type,
                peopleId: address.peopleId
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
