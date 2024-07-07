import { ResultExceptionArgs } from '@esliph/common'
import { Exception } from '@exceptions/exception'

export class HttpException extends Exception {
    constructor(errorInfo: ResultExceptionArgs, status: number) {
        super({
            title: errorInfo.title || 'Request failed',
            message: errorInfo.message || '',
            description: errorInfo.description,
            causes: errorInfo.causes || [],
            stack: errorInfo.stack,
        }, status)
    }
}
