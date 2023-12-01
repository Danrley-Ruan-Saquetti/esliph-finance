import { ResultExceptionArgs } from '@esliph/common'
import { HttpStatusCodes } from '@esliph/http'
import { ResultException } from '@common/exceptions/result.exception'

export class DatabaseException extends ResultException {
    constructor(errorInfo: ResultExceptionArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super(errorInfo, status)
    }
}
