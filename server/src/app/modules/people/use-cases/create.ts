import { DTO } from '@util/dto'
import { extractDigits } from '@util/geral'
import { DateService } from '@services/date'
import { z, Validator } from '@services/validator'
import { FormatterItinCnpj } from '@services/formatter-itin-cnpj'
import { PeopleModel } from '@modules/people/model'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/global'
import { BadRequestException } from '@exceptions/bad-request'

const { peopleRepository } = PeopleModel

const schemaCreate = z.object({
    name: z
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_PEOPLE_DTO.name.minCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .max(GLOBAL_PEOPLE_DTO.name.maxCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .transform(DTO.text.transform)
        .refine(name => name.split(' ').length > 1, { message: GLOBAL_PEOPLE_DTO.name.messageLastNameRequired }),
    itinCnpj: z
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.itinCnpj.messageRequired })
        .trim(),
    type: z
        .enum(GLOBAL_PEOPLE_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.type.messageEnumInvalid }) })
        .nullish(),
    gender: z
        .enum(GLOBAL_PEOPLE_DTO.gender.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.gender.messageEnumInvalid }) })
        .nullish(),
    dateOfBirth: DTO.date.schema
        .nullish()
        .refine(date => !date || (date as Date) < DateService.now()),
})
    .transform(({ type, ...rest }) => ({ ...rest, type: type || FormatterItinCnpj.getTypePerson(rest.itinCnpj) || PeopleModel.Type.NATURAL_PERSON }))
    .refine(({ type, itinCnpj }) => {
        if (type == PeopleModel.Type.NATURAL_PERSON) {
            if (!FormatterItinCnpj.validFormatItin(itinCnpj) && isNaN(+itinCnpj)) return false
            return FormatterItinCnpj.validItin(itinCnpj)
        }
        if (type == PeopleModel.Type.LEGAL_ENTITY) {
            if (!FormatterItinCnpj.validFormatCnpj(itinCnpj) && isNaN(+itinCnpj)) return false
            return FormatterItinCnpj.validCnpj(itinCnpj)
        }

        return false
    }, ({ type }) => ({ message: GLOBAL_PEOPLE_DTO[type == PeopleModel.Type.NATURAL_PERSON ? 'itin' : 'cnpj'].messageInvalid, path: ['itinCnpj'] }))
    .transform(({ itinCnpj, ...rest }) => ({ ...rest, itinCnpj: extractDigits(itinCnpj) }))

export type PeopleCreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: PeopleCreateDTOArgs) {
    const { dateOfBirth, gender, itinCnpj, name, type } = await validCreate(args)

    await peopleRepository.create({ data: { itinCnpj, name, type, dateOfBirth, gender } })

    return { message: 'Successfully registered people' }
}

export async function validCreate(args: PeopleCreateDTOArgs) {
    const { itinCnpj, name, type, dateOfBirth, gender } = Validator.parseNoSafe(args, schemaCreate)

    const peopleSameItinCnpj = await peopleRepository.findUnique({ where: { itinCnpj } })

    if (peopleSameItinCnpj)
        throw new BadRequestException({ title: 'Register people', message: 'People with the same ITIN/CNPJ already registered' })

    return { itinCnpj, name, type, dateOfBirth, gender }
}