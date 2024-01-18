import { ResultExceptionArgs } from '@core'
import { HttpStatusCodes } from '@core'
import { ResultException } from '@common/exceptions/result.exception'

export class DatabaseException extends ResultException {
    constructor(errorInfo: ResultExceptionArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super(errorInfo, status)
    }
}
