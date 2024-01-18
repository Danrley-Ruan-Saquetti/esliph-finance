import { Service } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { Result } from '@esliph/common'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { ID } from '@@types'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { AddressRepository } from '@modules/address/address.repository'

@Service({ name: 'people.use-case.belong' })
export class PeopleBelongUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('address.repository') private addressRepository: AddressRepository,
    ) {
        super()
    }

    async isBankAccountBelongPeople({ peopleId, bankAccountId }: { peopleId: ID, bankAccountId: ID }) {
        const result = await this.bankAccountRepository.findUnique({
            where: {
                id: Number(bankAccountId),
                peopleId: Number(peopleId)
            }
        })

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Bank Account Belong People' })
        }

        return Result.success({ ok: result.isSuccess() })
    }

    async isAddressBelongPeople({ peopleId, addressId }: { peopleId: ID, addressId: ID }) {
        const result = await this.addressRepository.findUnique({
            where: {
                id: Number(addressId),
                peopleId: Number(peopleId)
            }
        })

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Address Belong People' })
        }

        return Result.success({ ok: result.isSuccess() })
    }
}