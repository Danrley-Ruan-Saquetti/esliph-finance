import { Result } from '@esliph/util-node'
import { Exception } from './exception'
import { ExceptionModelArgs } from './model'

export class HttpException extends Exception {
    constructor(errorInfo: ExceptionModelArgs, status: number) {
        const errorResult = Result.failure(
            {
                message: errorInfo.message || '',
                title: errorInfo.title || 'Falha na requisição',
                causes: errorInfo.causes || [],
                description: errorInfo.description,
                stack: errorInfo.stack
            },
            status
        )

        super(errorResult.getError(), status)
    }
}