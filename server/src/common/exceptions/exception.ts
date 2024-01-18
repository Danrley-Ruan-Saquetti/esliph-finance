import { HttpStatusCodes, ResultException, ResultExceptionArgs } from '@core'

export class Exception extends ResultException {
    constructor(errorInfo: Partial<ResultExceptionArgs>, status = HttpStatusCodes.BAD_REQUEST) {
        super({ message: '', ...errorInfo, status })
    }
}
