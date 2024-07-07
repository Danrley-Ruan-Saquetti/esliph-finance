import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { CategoryModel } from '@modules/category/model'

const { categoryRepository } = CategoryModel

const schemaView = z.object({
    id: DTO.id.schema({ name: 'id' }),
    bankAccountId: DTO.id.schema({ name: 'Bank Account' }),
})

export type CategoryViewDTOArgs = z.input<typeof schemaView>

export async function view(args: CategoryViewDTOArgs) {
    const { bankAccountId, id } = Validator.parseNoSafe(args, schemaView)

    const category = await categoryRepository.findUniqueOrThrow({
        where: { id, bankAccountId },
        select: {
            id: true,
            name: true,
            color: true,
            isFavorite: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    return category
}
