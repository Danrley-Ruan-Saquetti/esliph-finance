import { HttpStatusCodes } from '@esliph/util-node'
import { ExceptionModelArgs } from './model'
import { ResultException } from './result.exception'

export class DatabaseException extends ResultException {
    constructor(errorInfo: ExceptionModelArgs, status: HttpStatusCodes.BAD_REQUEST) {
        super(errorInfo, status)
    }
}