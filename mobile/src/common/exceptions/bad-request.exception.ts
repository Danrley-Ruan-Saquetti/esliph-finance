import { ResultExceptionArgs } from '@esliph/common'
import { HttpStatusCodes } from '@esliph/http'
import { HttpException } from '@common/exceptions/http.exception'

const ERROR_INFO_DEFAULT = {
    title: 'Requisição',
    message: 'Falha na requisição',
    description: 'Houve um erro ao solicitar esse recurso. Por favor, tente novamente',
    causes: [],
}

export class BadRequestException extends HttpException {
    constructor(errorInfo?: ResultExceptionArgs) {
        super(
            {
                message: errorInfo?.message || ERROR_INFO_DEFAULT.message,
                causes: errorInfo?.causes || ERROR_INFO_DEFAULT.causes,
                description: errorInfo?.description || ERROR_INFO_DEFAULT.description,
                title: errorInfo?.title || ERROR_INFO_DEFAULT.title,
                stack: errorInfo?.stack || '',
            },
            HttpStatusCodes.BAD_REQUEST,
        )
    }
}
