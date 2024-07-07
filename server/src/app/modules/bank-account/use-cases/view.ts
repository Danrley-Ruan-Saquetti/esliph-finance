import { ID } from '@@types'
import { DTO } from '@util/dto'
import { Validator } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { BankAccountModel } from '@modules/bank-account/model'

const { bankAccountRepository } = BankAccountModel

export async function view(args: { id: ID }) {
    const id = Validator.parseNoSafe(args.id, DTO.id.schema({ name: 'id' }))

    const bankAccount = await bankAccountRepository.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            slug: true,
            code: true,
            active: true,
            balance: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    return {
        ...bankAccount,
        balance: MonetaryValue.toReal(bankAccount.balance),
    }
}
