import { Injection, Service } from '@core'
import { ID } from '@@types'
import { BadRequestException } from '@common/exceptions'
import { PeopleBelongUseCase } from '@modules/people/use-case/belong.use-case'

@Service({ name: 'people.control.belong' })
export class PeopleBelongControl {
    constructor(@Injection.Inject('people.use-case.belong') private belongUC: PeopleBelongUseCase) { }

    async verifyAddress({ addressId, peopleId }: { addressId: ID, peopleId: ID }) {
        const result = await this.belongUC.isAddressBelongPeople({ addressId, peopleId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Address of the Bank Account', message: 'Address not found' })
        }
    }

    async verifyBankAccount({ bankAccountId, peopleId }: { bankAccountId: ID, peopleId: ID }) {
        const result = await this.belongUC.isBankAccountBelongPeople({ bankAccountId, peopleId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Bank Account of the Bank Account', message: 'Bank Account not found' })
        }
    }
}