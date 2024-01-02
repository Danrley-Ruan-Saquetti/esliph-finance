import { DateTime } from 'luxon'

class DateService {
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
