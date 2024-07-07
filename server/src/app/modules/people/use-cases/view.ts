import { ID } from '@@types'
import { DTO } from '@util/dto'
import { Validator } from '@services/validator'
import { FormatterItinCnpj } from '@services/formatter-itin-cnpj'
import { PeopleModel } from '@modules/people/model'

const { peopleRepository } = PeopleModel

export async function view(args: { id: ID }) {
    const id = Validator.parseNoSafe(args.id, DTO.id.schema({ name: 'id' }))

    const people = await peopleRepository.findUniqueOrThrow({
        where: { id },
        include: {
            contacts: true,
            addresses: true,
        }
    })

    return {
        ...people,
        itinCnpj: FormatterItinCnpj.formatItinCnpj(people.itinCnpj)
    }
}
