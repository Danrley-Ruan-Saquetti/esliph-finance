import { ResultExceptionArgs } from '@core'
import { HttpStatusCodes } from '@core'
import { Exception } from '@common/exceptions/exception'

export class ResultException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super({ ...errorInfo }, status)
    }
}
