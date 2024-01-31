import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { LogErrorRepository } from '@modules/log/error/error.repository'
import { LogErrorModel } from '@modules/log/error/error.model'
import { GLOBAL_LOG_ERROR_DTO } from '@modules/log/error/error.global'

const schemaDTO = ValidatorService.schema.object({
    title: SchemaValidator
        .string({ 'required_error': GLOBAL_LOG_ERROR_DTO.title.messageRequired })
        .trim(),
    message: SchemaValidator
        .string({ 'required_error': GLOBAL_LOG_ERROR_DTO.message.messageRequired })
        .trim(),
    description: SchemaValidator
        .string()
        .trim()
        .optional()
        .default(GLOBAL_LOG_ERROR_DTO.description.default),
    stack: SchemaValidator
        .string()
        .trim()
        .optional()
        .default(GLOBAL_LOG_ERROR_DTO.stack.default),
    origin: SchemaValidator
        .string({ 'required_error': GLOBAL_LOG_ERROR_DTO.origin.messageRequired })
        .trim(),
    dateTime: ValidatorService.schema.coerce
        .date()
        .default(GLOBAL_LOG_ERROR_DTO.dateTime.default())
        .transform(GLOBAL_DTO.date.transform),
    causes: ValidatorService.schema.array(ValidatorService.schema.object({
        message: ValidatorService.schema
            .string({ 'required_error': GLOBAL_LOG_ERROR_DTO.causes.message.messageRequired })
            .trim(),
        cause: ValidatorService.schema
            .string()
            .trim()
            .optional()
            .default(GLOBAL_LOG_ERROR_DTO.causes.cause.default),
    }))
        .optional()
        .default([])
})

export type LogErrorCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'log-error.use-case.create' })
export class LogErrorCreateUseCase extends UseCase {
    constructor(@Injection.Inject('log-error.repository') private logErrorRepository: LogErrorRepository) {
        super()
    }

    async perform(args: LogErrorCreateDTOArgs) {
        const { message, origin, title, causes, dateTime, description, stack } = this.validateDTO(args, schemaDTO)

        await this.registerLogError({ message, origin, title, causes, dateTime, description, stack })

        return Result.success({ message: 'LogError registered successfully' })
    }

    private async registerLogError(data: LogErrorModel.CreateArgs) {
        const registerLogErrorResult = await this.logErrorRepository.create({ data })

        if (registerLogErrorResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerLogErrorResult.getError(),
            title: 'Register LogError',
        })
    }
}
