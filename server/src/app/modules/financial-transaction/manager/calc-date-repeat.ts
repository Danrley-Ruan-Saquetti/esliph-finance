import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/global'

export class CalcDateRepeatManager {

    static calcAllNextDates(startDate: Date, frequency: FinancialTransactionModel.Frequency, timesToRepeat = 1) {
        return new Array({ length: timesToRepeat })
            .map((_, i) => CalcDateRepeatManager.calcNextDate(startDate, frequency, i))
    }

    static calcNextDate(startDate: Date, frequency: FinancialTransactionModel.Frequency, alreadyRepeated = 0) {
        alreadyRepeated += 1
        const daysMore = GLOBAL_FINANCIAL_TRANSACTION_RULES.frequencyInDays[frequency]

        const nextDate = new Date(startDate)

        nextDate.setDate(startDate.getDate() + (daysMore * alreadyRepeated))

        return nextDate
    }
}