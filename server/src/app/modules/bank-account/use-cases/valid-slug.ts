import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { bankAccountRepository } = BankAccountModel

const schemaCreate = z.object({
    ignoreBankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id
        .optional(),
    peopleId: GLOBAL_BANK_ACCOUNT_DTO.people.id,
    slug: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.slug.messageRequired })
        .trim(),
})

export type CreateDTOArgs = z.input<typeof schemaCreate>

export async function validSlug(args: CreateDTOArgs) {
    const { peopleId, slug, ignoreBankAccountId } = Validator.parseNoSafe(args, schemaCreate)

    if (!DTO.isValidSlug(slug))
        return { isValid: false, message: GLOBAL_BANK_ACCOUNT_DTO.slug.messageRequired }

    const isBankAccountSameName = await bankAccountRepository.isExists({
        where: {
            ...(ignoreBankAccountId && {
                id: {
                    not: {
                        equals: ignoreBankAccountId
                    }
                }
            }),
            peopleId,
            slug
        }
    })

    if (isBankAccountSameName)
        return { isValid: false, message: 'Another bank account with the same slug already exists' }

    return { isValid: true, message: 'Valid Slug' }
}