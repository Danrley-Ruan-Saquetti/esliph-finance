import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { isValidCnpj, isValidItin } from '@util'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'
import { PeopleRepository } from '@modules/people/people.repository'
import { PeopleModel } from '@modules/people/people.model'

const schemaPeoplePeopleAndPeopleDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_PEOPLE_DTO.name.minCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .max(GLOBAL_PEOPLE_DTO.name.maxCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform),
    itinCnpj: ValidatorService.schema
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.itin.messageRequired })
        .trim(),
    type: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.type.messageEnumInvalid }) }),
    gender: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.gender.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.gender.messageEnumInvalid }) })
        .optional(),
    dateOfBirth: GLOBAL_DTO.date.schema
        .optional()
        .refine(date => !date || date < new Date(Date.now()))
        .transform(date => date || undefined),
})
    .refine(({ type, itinCnpj: itin }) => type !== PeopleModel.Type.NATURAL_PERSON || isValidItin(itin), { message: GLOBAL_PEOPLE_DTO.itin.messageInvalid })
    .refine(({ type, itinCnpj: cnpj }) => type !== PeopleModel.Type.LEGAL_ENTITY || isValidCnpj(cnpj), { message: GLOBAL_PEOPLE_DTO.cnpj.messageInvalid })

export type PeoplePeoplePeopleAndPeopleDTOArgs = SchemaValidator.input<typeof schemaPeoplePeopleAndPeopleDTO>

@Service({ name: 'people.use-case.create' })
export class PeoplePeopleUseCase extends UseCase {
    constructor(
        @Injection.Inject('people.repository') private peopleRepository: PeopleRepository,
    ) {
        super()
    }

    async perform(args: PeoplePeoplePeopleAndPeopleDTOArgs) {
        const { itinCnpj, type, dateOfBirth = null, gender = null, name } = this.validateDTO(args, schemaPeoplePeopleAndPeopleDTO)

        await this.verifyIsAlreadyItinCnpjExists(itinCnpj, type)
        await this.registerPeople({ active: true, dateOfBirth, gender, itinCnpj, name, type })

        return Result.success({ message: 'Register people successfully' })
    }

    private async verifyIsAlreadyItinCnpjExists(itinCnpj: string, type: PeopleModel.Type) {
        const peopleResult = await this.peopleRepository.findByItinCnpj(itinCnpj)

        if (peopleResult.isSuccess()) {
            throw new BadRequestException({ title: 'Create People', message: `${type == PeopleModel.Type.LEGAL_ENTITY ? 'CNPJ' : type == PeopleModel.Type.NATURAL_PERSON ? 'ITIN' : 'ITIN/CNPJ'} is already exists` })
        }

        if (peopleResult.isErrorInOperation()) {
            throw new BadRequestException({ ...peopleResult.getError(), title: 'Create People' })
        }
    }

    private async registerPeople({ active, dateOfBirth, gender, itinCnpj, name, type }: PeopleModel.Model) {
        const registerPeopleResult = await this.peopleRepository.register({ active, dateOfBirth, gender, itinCnpj, name, type })

        if (registerPeopleResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerPeopleResult.getError(),
            title: 'Register People',
        })
    }
}
