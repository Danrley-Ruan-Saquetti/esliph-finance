import { HttpStatusCodes } from '@esliph/util-node'
import { HttpException } from './http.exception'
import { ExceptionModelArgs } from './model'

const ERROR_INFO_DEFAULT = {
    title: 'Não Autorizado',
    message: 'Requisição não autorizada',
    description: 'Você não tem permissão para acessar este recurso',
    causes: []
}

export class UnauthorizedException extends HttpException {
    constructor(errorInfo?: ExceptionModelArgs) {
        super(
            {
                message: errorInfo?.message || ERROR_INFO_DEFAULT.message,
                causes: errorInfo?.causes || ERROR_INFO_DEFAULT.causes,
                description: errorInfo?.description || ERROR_INFO_DEFAULT.description,
                title: errorInfo?.title || ERROR_INFO_DEFAULT.title,
                stack: errorInfo?.stack || ''
            },
            HttpStatusCodes.UNAUTHORIZED
        )
    }
}