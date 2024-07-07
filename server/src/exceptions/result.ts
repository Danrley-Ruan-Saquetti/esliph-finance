import { ResultExceptionArgs } from '@esliph/common'
import { Exception } from '@exceptions/exception'
import { StatusCode } from '@enums/http'

export class ResultException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status = StatusCode.BAD_REQUEST) {
        super({ ...errorInfo }, status)
    }
}
