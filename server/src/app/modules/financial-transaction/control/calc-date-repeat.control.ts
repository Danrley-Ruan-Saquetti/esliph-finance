import { Service } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { DateService } from '@services/date.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/financial-transaction.global'

@Service({ name: 'calc-date-repeat.control' })
export class CalcDateRepeatControl {
    constructor(@Injection.Inject('date') private dateService: DateService) { }

    calcAllNextDates(startDate: Date, frequency: FinancialTransactionModel.Frequency, timesToRepeat: number) {
        const dates: Date[] = []

        for (let i = 0; i < timesToRepeat; i++) {
            dates.push(this.calcNextDate(startDate, frequency, i))
        }

        return dates
    }

    calcNextDate(startDate: Date, frequency: FinancialTransactionModel.Frequency, alreadyRepeated = 0) {
        alreadyRepeated += 1
        const daysMore = GLOBAL_FINANCIAL_TRANSACTION_RULES.frequencyInDays[frequency]

        const nextDate = new Date(this.dateService.converterToUTC(startDate))

        nextDate.setDate(startDate.getDate() + (daysMore * alreadyRepeated))

        return nextDate
    }
}