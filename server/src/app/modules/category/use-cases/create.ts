import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { CategoryModel } from '@modules/category/model'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/global'

const { bankAccountRepository } = BankAccountModel
const { categoryRepository } = CategoryModel

const schemaCreate = z.object({
    bankAccountId: GLOBAL_CATEGORY_DTO.bankAccount.id,
    name: z
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_CATEGORY_DTO.name.minCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .max(GLOBAL_CATEGORY_DTO.name.maxCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .transform(DTO.text.transform),
    color: z
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.color.messageRequired })
        .trim()
        .max(GLOBAL_CATEGORY_DTO.color.maxCharacters, { message: GLOBAL_CATEGORY_DTO.color.messageRangeCharacters })
        .regex(DTO.color.regex, { message: DTO.color.messageRegex })
        .transform(DTO.color.transform),
    isFavorite: z
        .boolean()
        .default(GLOBAL_CATEGORY_DTO.isFavorite.default),
})

export type CategoryCreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: CategoryCreateDTOArgs) {
    const { bankAccountId, color, isFavorite, name } = Validator.parseNoSafe(args, schemaCreate)

    await bankAccountRepository.checkExistsOrTrow({ where: { id: bankAccountId } })

    await categoryRepository.create({
        data: {
            bankAccountId,
            name,
            color,
            isFavorite,
        }
    })

    return { message: 'Category created successfully' }
}