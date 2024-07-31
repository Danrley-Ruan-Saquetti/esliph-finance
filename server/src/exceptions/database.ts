import { StatusCode } from '@enums/http'
import { ResultExceptionArgs } from '@esliph/common'
import { ResultException } from '@exceptions/result'

export class DatabaseException extends ResultException {
    constructor(errorInfo: ResultExceptionArgs, status = StatusCode.INTERNAL_SERVER_ERROR) {
        super(errorInfo, status)
    }
}
