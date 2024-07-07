import { isString } from '@util/types'

export class DateService {
    static now() {
        return new Date(Date.now())
    }

    static converterTZ(dt: Date | string, tz: string) {
        let date = (isString(dt) ? new Date(dt) : dt) as Date

        return new Date(date.toLocaleString('en-US', { timeZone: tz }))
    }
}