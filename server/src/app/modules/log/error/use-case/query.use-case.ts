import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { LogErrorRepository } from '@modules/log/error/error.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'log-error.use-case.query' })
export class LogErrorQueryUseCase extends UseCase {
    constructor(@Injection.Inject('logError.repository') private logErrorRepository: LogErrorRepository) {
        super()
    }

    async queryMany() {
        const logErrorsResult = await this.logErrorRepository.findMany({})

        if (!logErrorsResult.isSuccess()) {
            return Result.failure({ ...logErrorsResult.getError(), title: 'Query Log Errors' })
        }

        return Result.success(logErrorsResult.getValue() || [])
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const logErrorResult = await this.logErrorRepository.findUnique({ where: { id } })

        if (!logErrorResult.isSuccess()) {
            return Result.failure({ ...logErrorResult.getError(), title: 'Query Log Error' })
        }

        return Result.success(logErrorResult.getValue())
    }
}
