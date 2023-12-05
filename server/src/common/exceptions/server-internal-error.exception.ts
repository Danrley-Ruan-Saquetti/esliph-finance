import { HttpStatusCodes } from '@esliph/http'
import { ResultExceptionArgs } from '@esliph/common'
import { HttpException } from '@common/exceptions/http.exception'

const ERROR_INFO_DEFAULT = {
    title: 'Erro interno do servidor',
    message: 'Houve um erro interno no servido',
    description: '',
    causes: [],
}

export class ServerInternalErrorException extends HttpException {
    constructor(errorInfo: ResultExceptionArgs = { message: '' }) {
        super(
            {
                message: errorInfo.message ?? ERROR_INFO_DEFAULT.message,
                causes: errorInfo.causes ?? ERROR_INFO_DEFAULT.causes,
                description: errorInfo.description ?? ERROR_INFO_DEFAULT.description,
                title: errorInfo.title ?? ERROR_INFO_DEFAULT.title,
                stack: errorInfo.stack ?? '',
            },
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
        )
    }
}
