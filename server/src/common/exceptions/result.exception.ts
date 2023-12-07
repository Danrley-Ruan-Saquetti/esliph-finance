import { ResultExceptionArgs } from '@esliph/common'
import { HttpStatusCodes } from '@esliph/http'
import { Exception } from '@common/exceptions/exception'

export class ResultException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super({ ...errorInfo }, status)
    }
}
