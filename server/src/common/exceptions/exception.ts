import { HttpStatusCodes } from '@esliph/http'
import { ResultException, ResultExceptionArgs } from '@esliph/common'

export class Exception extends ResultException {
    constructor(errorInfo: Partial<ResultExceptionArgs>, status = HttpStatusCodes.BAD_REQUEST) {
        super({ message: '', ...errorInfo, status })
    }
}
