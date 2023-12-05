import { Result, ResultExceptionArgs } from '@esliph/common'
import { Exception } from '@common/exceptions/exception'

export class HttpException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status: number) {
        const errorResult = Result.failure(
            {
                message: errorInfo.message || '',
                title: errorInfo.title || 'Request failed',
                causes: errorInfo.causes || [],
                description: errorInfo.description,
                stack: errorInfo.stack,
            },
            status,
        )

        super(errorResult.getError(), status)
    }
}
