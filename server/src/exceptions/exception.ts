import { ResultException, ResultExceptionArgs } from '@esliph/common'
import { StatusCode } from '@enums/http'

export class Exception extends ResultException {
    constructor(errorInfo: Partial<ResultExceptionArgs>, status = StatusCode.BAD_REQUEST) {
        super({ message: '', ...errorInfo, status })
    }
}
