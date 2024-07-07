import { ResultExceptionArgs } from '@esliph/common'
import { HttpException } from '@exceptions/http'
import { StatusCode } from '@enums/http'

const ERROR_INFO_DEFAULT = {
    title: 'Not Found',
    message: 'Router not found',
    description: '',
    causes: [],
}

export class RouterNotFoundException extends HttpException {
    constructor(errorInfo: ResultExceptionArgs = { message: '' }) {
        super(
            {
                message: errorInfo.message ?? ERROR_INFO_DEFAULT.message,
                causes: errorInfo.causes ?? ERROR_INFO_DEFAULT.causes,
                description: errorInfo.description ?? ERROR_INFO_DEFAULT.description,
                title: errorInfo.title ?? ERROR_INFO_DEFAULT.title,
                stack: errorInfo.stack ?? '',
            },
            StatusCode.NOT_FOUND,
        )
    }
}
