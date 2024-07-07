import { DTO } from '@util/dto'
import { isUndefined } from '@util/types'
import { BadRequestException } from '@exceptions/bad-request'
import { z, Validator } from '@services/validator'
import { validSlug } from '@modules/bank-account/use-cases/valid-slug'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { bankAccountRepository } = BankAccountModel

const schemaUpdate = z.object({
    id: GLOBAL_BANK_ACCOUNT_DTO.id,
    name: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_BANK_ACCOUNT_DTO.name.minCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .max(GLOBAL_BANK_ACCOUNT_DTO.name.maxCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .nullish()
        .transform(DTO.text.transformOptional),
    slug: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.slug.messageRequired })
        .trim()
        .nullish()
        .transform(DTO.text.transformOptional),
})

export type BankAccountUpdateDTOArgs = z.input<typeof schemaUpdate>

export async function update(args: BankAccountUpdateDTOArgs) {
    const { id, name, slug } = Validator.parseNoSafe(args, schemaUpdate)

    if (isUndefined(name) && isUndefined(slug))
        return { message: 'No data updated' }

    const bankAccount = await bankAccountRepository.findUniqueOrThrow({ where: { id } })

    if (slug) {
        const isValidSlug = await validSlug({ ignoreBankAccountId: bankAccount.id, peopleId: bankAccount.peopleId, slug, })

        if (!isValidSlug.isValid)
            throw new BadRequestException({ title: 'Bank account slug validation', message: isValidSlug.message || 'Invalid Slug' })
    }

    await bankAccountRepository.update({
        data: { name, slug, },
        where: { id: bankAccount.id }
    })

    return { message: 'Bank account updated successfully' }
}