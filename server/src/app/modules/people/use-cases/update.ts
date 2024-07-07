import { DTO } from '@util/dto'
import { isNull, isUndefined } from '@util/types'
import { DateService } from '@services/date'
import { z, Validator } from '@services/validator'
import { PeopleModel } from '@modules/people/model'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/global'

const { peopleRepository } = PeopleModel

const schemaUpdate = z.object({
    id: GLOBAL_PEOPLE_DTO.id,
    name: z
        .string()
        .trim()
        .min(GLOBAL_PEOPLE_DTO.name.minCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .max(GLOBAL_PEOPLE_DTO.name.maxCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .nullish()
        .transform(DTO.text.transformOptional)
        .refine(name => !name || name.split(' ').length > 1, { message: GLOBAL_PEOPLE_DTO.name.messageLastNameRequired }),
    gender: z
        .enum(GLOBAL_PEOPLE_DTO.gender.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.gender.messageEnumInvalid }) })
        .nullish(),
    dateOfBirth: DTO.date.schema
        .nullish()
        .refine(date => !date || (date as Date) < DateService.now()),
})

export type PeopleUpdateDTOArgs = z.input<typeof schemaUpdate>

export async function update(args: PeopleUpdateDTOArgs) {
    const { id, name, dateOfBirth, gender } = Validator.parseNoSafe(args, schemaUpdate)

    if (isUndefined(name) && isUndefined(dateOfBirth) && isUndefined(gender))
        return { message: 'No data updated' }

    await peopleRepository.checkExistsOrTrow({ where: { id } })

    await peopleRepository.update({
        data: { name: isNull(name) ? undefined : name, dateOfBirth, gender },
        where: { id }
    })

    return { message: 'Successfully updated people' }
}