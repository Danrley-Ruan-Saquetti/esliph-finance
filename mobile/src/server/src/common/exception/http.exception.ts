import { Result } from '@esliph/util-node'
import { Exception } from './exception'
import { ExceptionModelArgs } from './model'

export class HttpException extends Exception {
    constructor(errorInfo: ExceptionModelArgs, status: number) {
        const errorResult = Result.failure(
            {
                message: errorInfo.message,
                title: errorInfo.title || 'Request Exception',
                causes: errorInfo.causes || [],
                description: errorInfo.description
            },
            status
        )

        super(errorResult.getError(), status)
    }
}