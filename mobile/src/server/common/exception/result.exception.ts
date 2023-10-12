import { HttpStatusCodes } from '@esliph/util-node'
import { Exception } from './exception'
import { ExceptionModelArgs } from './model'

export class ResultException extends Exception {
    constructor(errorInfo: ExceptionModelArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super(errorInfo, status)
    }
}