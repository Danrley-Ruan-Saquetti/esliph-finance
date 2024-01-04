import { Service } from '@esliph/module'
import { DateTime } from 'luxon'

@Service({ name: 'global.service.date' })
export class DateService {
    static DATE = DateTime

    now() {
        return new Date(this.DATE.now().toUTC().toISO())
    }

    converterToUTC(date: Date) {
        return new Date(this.DATE.fromJSDate(date).toISO() as string)
    }

    sameDate(date1: Date, date2: Date) {
        return this.DATE.fromJSDate(date1).hasSame(this.DATE.fromJSDate(date2), 'day')
    }

    get DATE() {
        return DateService.DATE
    }
}
