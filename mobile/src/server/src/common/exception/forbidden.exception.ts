import { HttpStatusCodes } from '@esliph/util-node'
import { HttpException } from './http.exception'
import { ExceptionModelArgs } from './model'

const ERROR_INFO_DEFAULT = {
    title: 'Proibido',
    message: 'Requisição negada',
    description: 'O acesso a este recurso é restrito',
    causes: []
}

export class ForbiddenException extends HttpException {
    constructor(errorInfo?: ExceptionModelArgs) {
        super(
            {
                message: errorInfo?.message || ERROR_INFO_DEFAULT.message,
                causes: errorInfo?.causes || ERROR_INFO_DEFAULT.causes,
                description: errorInfo?.description || ERROR_INFO_DEFAULT.description,
                title: errorInfo?.title || ERROR_INFO_DEFAULT.title,
                stack: errorInfo?.stack || ''
            },
            HttpStatusCodes.FORBIDDEN
        )
    }
}