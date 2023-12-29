import { Result, ResultExceptionArgs } from '@esliph/common'
import { Exception } from '@common/exceptions/exception'

export class HttpException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status: number) {
        const errorResult = Result.failure(
            {
                title: errorInfo.title || 'Request failed',
                message: errorInfo.message || '',
                description: errorInfo.description,
                causes: errorInfo.causes || [],
                stack: errorInfo.stack,
            },
            status,
        )

        super(errorResult.getError(), status)
    }
}
