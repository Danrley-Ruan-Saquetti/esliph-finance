import { ResultExceptionArgs } from '@esliph/common'
import { HttpException } from '@exceptions/http'
import { StatusCode } from '@enums/http'

const ERROR_INFO_DEFAULT = {
    title: 'Request',
    message: 'Request failed',
    description: '',
    causes: [],
}

export class BadRequestException extends HttpException {
    constructor(errorInfo?: ResultExceptionArgs) {
        super(
            {
                title: errorInfo?.title || ERROR_INFO_DEFAULT.title,
                message: errorInfo?.message || ERROR_INFO_DEFAULT.message,
                description: errorInfo?.description || ERROR_INFO_DEFAULT.description,
                causes: errorInfo?.causes || ERROR_INFO_DEFAULT.causes,
                stack: errorInfo?.stack || '',
            },
            StatusCode.BAD_REQUEST,
        )
    }
}
