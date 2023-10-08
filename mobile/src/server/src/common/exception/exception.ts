import { ExceptionEsliph, HttpStatusCodes } from '@esliph/util-node'
import { ExceptionModelArgs } from './model'

export class Exception extends ExceptionEsliph.ResultException {
    constructor(errorInfo: ExceptionModelArgs, status = HttpStatusCodes.BAD_REQUEST) {
        super({ message: '', ...errorInfo, status })
    }
}