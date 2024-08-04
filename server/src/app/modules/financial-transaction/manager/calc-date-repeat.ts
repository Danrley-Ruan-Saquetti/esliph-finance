import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/global'

export class CalcDateRepeatManager {

    static isDateContainedDeadlineToRepeat(date: Date, startDate: Date, frequency: FinancialTransactionModel.Frequency, timesToRepeat = 1) {
        const nextDate = CalcDateRepeatManager.calcNextDate(startDate, frequency, timesToRepeat)

        date.setHours(0, 0, 0, 0)
        nextDate.setHours(0, 0, 0, 0)

        return nextDate <= date
    }

    static calcAllNextDates(startDate: Date, frequency: FinancialTransactionModel.Frequency, timesToRepeat = 1) {
        return new Array({ length: timesToRepeat })
            .map((_, i) => CalcDateRepeatManager.calcNextDate(startDate, frequency, i))
    }

    static calcNextDate(startDate: Date, frequency: FinancialTransactionModel.Frequency, alreadyRepeated = 0) {
        const daysMore = GLOBAL_FINANCIAL_TRANSACTION_RULES.frequencyInDays[frequency]

        const nextDate = new Date(startDate)
        const nextDateInDays = startDate.getDate() + (daysMore * (alreadyRepeated + 1))

        nextDate.setDate(nextDateInDays)

        return nextDate
    }
}