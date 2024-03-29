import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { PaymentCreateUseCase, PaymentCreateDTOArgs } from '@modules/payment/use-case/create.use-case'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaNumber = SchemaValidator.coerce.number()

export type FinancialExpenseLiquidateDTOArgs = PaymentCreateDTOArgs

@Service({ name: 'financial-expense.use-case.liquidate' })
export class FinancialExpenseLiquidateUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('payment.use-case.create') private createUC: PaymentCreateUseCase,
    ) {
        super()
    }

    async perform(args: PaymentCreateDTOArgs) {
        const financialTransactionId = this.validateDTO(args.financialTransactionId, schemaNumber)
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.performUC({ ...args, financialTransactionId })
            await transaction.commit()

            return result
        } catch (err: any) {
            await transaction.rollback()
            throw err
        }
    }

    async performUC(args: FinancialExpenseLiquidateDTOArgs) {
        const result = await this.createUC.perform({ ...args })

        if (!result.isSuccess()) {
            throw new BadRequestException({ ...result.getError() })
        }

        const newSituation = this.getNewSituationFinancialTransaction(result.getValue().paidInFull)
        await this.updateSituationFinancialTransaction(args.financialTransactionId, newSituation)

        return Result.success({ message: result.getValue().message })
    }

    getNewSituationFinancialTransaction(paidInFull: boolean) {
        if (paidInFull) {
            return FinancialTransactionModel.Situation.PAID_OUT
        }
        return FinancialTransactionModel.Situation.PARTIALLY_PAID
    }

    async updateSituationFinancialTransaction(financialTransactionId: ID, newSituation: FinancialTransactionModel.Situation) {
        const resultUpdate = await this.transactionRepository.update({ data: { situation: newSituation }, where: { id: financialTransactionId } })

        if (resultUpdate.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...resultUpdate.getError(), title: 'Update Financial Transaction' })
    }
}
