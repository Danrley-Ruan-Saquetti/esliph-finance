import bcrypt from 'bcrypt'
import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { BadRequestException } from '@exceptions/bad-request'
import { validSlug } from '@modules/bank-account/use-cases/valid-slug'
import { PeopleModel } from '@modules/people/model'
import { generateCode } from '@modules/bank-account/use-cases/generate-code'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { bankAccountRepository } = BankAccountModel
const { peopleRepository } = PeopleModel

const schemaCreate = z.object({
    peopleId: GLOBAL_BANK_ACCOUNT_DTO.people.id,
    name: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_BANK_ACCOUNT_DTO.name.minCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .max(GLOBAL_BANK_ACCOUNT_DTO.name.maxCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .transform(DTO.text.transform),
    password: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_BANK_ACCOUNT_DTO.password.regex, { message: GLOBAL_BANK_ACCOUNT_DTO.password.messageRegex }),
    slug: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.slug.messageRequired })
        .trim(),
})

export type CreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: CreateDTOArgs) {
    const { name, peopleId, password, slug } = Validator.parseNoSafe(args, schemaCreate)

    await peopleRepository.checkExistsOrTrow({ where: { id: peopleId } })

    const isValidSlug = await validSlug({ peopleId, slug })

    if (!isValidSlug.isValid)
        throw new BadRequestException({ title: 'Bank account slug validation', message: isValidSlug.message || 'Invalid Slug' })

    const passwordHashed = bcrypt.hashSync(password, 5)

    const { code } = await generateCode()

    await bankAccountRepository.create({
        data: {
            peopleId,
            name,
            slug,
            code,
            password: passwordHashed,
        }
    })

    return { message: 'Bank account created successfully' }
}