import { DTO } from '@util/dto'
import { someHasValue } from '@util/types'
import { Validator, z } from '@services/validator'
import { CategoryModel } from '@modules/category/model'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/global'

const { categoryRepository } = CategoryModel

const schemaUpdate = z.object({
    id: GLOBAL_CATEGORY_DTO.id,
    bankAccountId: GLOBAL_CATEGORY_DTO.bankAccount.id,
    name: z
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_CATEGORY_DTO.name.minCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .max(GLOBAL_CATEGORY_DTO.name.maxCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .nullish()
        .transform(DTO.text.transformOptional),
    color: z
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.color.messageRequired })
        .trim()
        .max(GLOBAL_CATEGORY_DTO.color.maxCharacters, { message: GLOBAL_CATEGORY_DTO.color.messageRangeCharacters })
        .regex(DTO.color.regex, { message: DTO.color.messageRegex })
        .nullish()
        .transform(DTO.text.transformOptional),
    isFavorite: z
        .boolean()
        .optional(),
})

export type CategoryUpdateDTOArgs = z.input<typeof schemaUpdate>

export async function update(args: CategoryUpdateDTOArgs) {
    const { id, bankAccountId, color, isFavorite, name } = Validator.parseNoSafe(args, schemaUpdate)

    if (!someHasValue(name, color, isFavorite))
        return { message: 'No data updated' }

    await categoryRepository.checkExistsOrTrow({ where: { id, bankAccountId: bankAccountId } })

    await categoryRepository.update({
        data: { name, color, isFavorite },
        where: { id }
    })

    return { message: 'Category updated successfully' }
}