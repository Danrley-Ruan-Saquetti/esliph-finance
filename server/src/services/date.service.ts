import { Service } from '@esliph/module'
import { DateTime } from 'luxon'

@Service({ name: 'global.service.date' })
export class DateService {
    static DATE = DateTime

    now() {
        return new Date(this.DATE.now().toUTC().toISO())
    }

    converterToUTC(date: Date) {
        return this.DATE.fromJSDate(date)
    }

    get DATE() {
        return DateService.DATE
    }
}
