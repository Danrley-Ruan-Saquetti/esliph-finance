import { ID } from '@@types'
import { DTO } from '@util/dto'
import { Validator } from '@services/validator'
import { FormatterItinCnpj } from '@services/formatter-itin-cnpj'
import { UserModel } from '@modules/user/model'

const { userRepository } = UserModel

export async function view(args: { id: ID }) {
    const id = Validator.parseNoSafe(args.id, DTO.id.schema({ name: 'id' }))

    const user = await userRepository.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            active: true,
            code: true,
            login: true,
            type: true,
            createdAt: true,
            updatedAt: true,
            people: true,
        }
    })

    return {
        ...user,
        people: {
            ...user.people,
            itinCnpj: FormatterItinCnpj.formatItinCnpj(user.people.itinCnpj)
        }
    }
}
