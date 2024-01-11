import { GLOBAL_DTO } from '@global'
import { PeopleModel } from './people.model'

export const GLOBAL_PEOPLE_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'People' }),
    gender: {
        enum: [PeopleModel.Gender.MASCULINE, PeopleModel.Gender.FEMININE] as const,
        messageEnumInvalid: 'Gender invalid'
    }
}
