import { Injection, Service, Result } from '@core'
import { GLOBAL_APP } from '@global'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { FinancialTransactionIncomeLatedTemplate } from '@templates/financial-transaction-lated'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { PeopleRepository } from '@modules/people/people.repository'

@Service({ name: 'financial-transaction.use-case.update-situation-late' })
export class FinancialTransactionUpdateSituationLateUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('people.repository') private peopleRepository: PeopleRepository,
        @Injection.Inject('mail.use-case.create') private mailCreateUC: MailCreateUseCase,
    ) {
        super()
    }

    async perform() {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.performUC()
            await transaction.commit()

            return result
        } catch (err: any) {
            await transaction.rollback()

            return Result.failure({
                title: 'Update Situations Transactions Late',
                ...err,
                message: `Cannot be update situation of the transactions. Error: "${err.message || ''}"`,
            })
        }
    }

    private async performUC() {
        const financialTransactionsLated = await this.queryFinancialTransactionsLated()
        await this.performManual({ ids: financialTransactionsLated.map(({ id }) => id) })
        await this.sendMailTransactionsLate(financialTransactionsLated)

        return Result.success({ message: 'Update situations of the transactions successfully' })
    }

    async performManual({ ids }: { ids: ID[], isSendNotification?: boolean }) {
        const financialTransactionsLated = await this.queryFinancialTransactionsLatedByIds(ids)
        await this.update(financialTransactionsLated.map(({ id }) => id))
        await this.sendMailTransactionsLate(financialTransactionsLated)

        return Result.success({ message: 'Update situations of the transactions successfully' })
    }

    private async queryFinancialTransactionsLatedByIds(ids: ID[]) {
        const dateNow = this.dateService.now()

        const financialTransactionsLated = await this.transactionRepository.findMany({
            where: {
                id: {
                    in: ids
                },
                expiresIn: { lt: dateNow },
            },
            orderBy: {
                priority: 'desc'
            }
        })

        if (!financialTransactionsLated.isSuccess()) {
            throw new BadRequestException({ ...financialTransactionsLated.getError(), title: 'Query Financial Transactions' })
        }

        return financialTransactionsLated.getValue()
    }

    private async queryFinancialTransactionsLated() {
        const dateNow = this.dateService.now()

        const financialTransactionsLated = await this.transactionRepository.findMany({
            where: {
                isSendNotification: true,
                expiresIn: { lt: dateNow },
                situation: {
                    in: [FinancialTransactionModel.Situation.PENDING],
                },
            },
            orderBy: {
                priority: 'desc'
            }
        })

        if (!financialTransactionsLated.isSuccess()) {
            throw new BadRequestException({ ...financialTransactionsLated.getError(), title: 'Query Financial Transactions Lated' })
        }

        return financialTransactionsLated.getValue()
    }

    private async update(ids: ID[]) {
        const result = await this.transactionRepository.updateMany({
            data: { situation: FinancialTransactionModel.Situation.LATE },
            where: {
                id: {
                    in: ids
                }
            },
        })

        if (!result.isSuccess()) {
            throw new BadRequestException({ ...result.getError(), title: 'Update Financial Transactions Lated' })
        }
    }

    private async sendMailTransactionsLate(financialTransactions: FinancialTransactionModel.Model[]) {
        const results: Result[] = []

        for (let i = 0; i < financialTransactions.length; i++) {
            const transaction = financialTransactions[i]

            try {
                const result = await this.sendMail(transaction)
                results.push(result)
            } catch (err: any) {
                results.push(Result.failure({
                    title: 'Send Mail About Transaction Lated',
                    ...err,
                    message: `Cannot be send mail of the transactions lated. Error: "${err.message || ''}"`,
                }))
            }
        }

        return results
    }

    private async sendMail(financialTransaction: FinancialTransactionModel.Model) {
        const people = await this.queryPeopleByBankAccountId(financialTransaction.bankAccountId)

        const emailPeople = people.contacts[0]?.contact || ''

        if (!emailPeople) {
            return Result.failure({ title: 'Send Mail About Transaction Lated', message: 'People has\'nt a e-mail contact' })
        }

        const subjectResult = FinancialTransactionModel.Type.INCOME ?
            FinancialTransactionIncomeLatedTemplate({
                peopleName: people.name,
                transactionName: financialTransaction.title,
            }) :
            FinancialTransactionIncomeLatedTemplate({
                peopleName: people.name,
                transactionName: financialTransaction.title,
            })

        if (!subjectResult.isSuccess()) {
            return Result.failure({ title: 'Send Mail About Transaction Lated', message: 'Unable to generate e-mail content' })
        }

        const result = await this.mailCreateUC.perform({
            bankAccountId: financialTransaction.bankAccountId,
            recipient: emailPeople,
            sender: `${GLOBAL_APP.name} <${GLOBAL_APP.mail}>`,
            content: `Financial Transaction "${financialTransaction.title}" lated`,
            subject: subjectResult.getValue()
        })

        return result
    }

    private async queryPeopleByBankAccountId(bankAccountId: ID) {
        const peopleResult = await this.peopleRepository.findFirst({
            where: {
                bankAccounts: {
                    some: { id: bankAccountId }
                }
            },
            include: {
                contacts: {
                    where: {
                        type: 'EMAIL'
                    }
                }
            }
        })

        if (!peopleResult.isSuccess()) {
            throw new BadRequestException({ ...peopleResult.getError(), title: 'Query People' })
        }

        return peopleResult.getValue()
    }
}
