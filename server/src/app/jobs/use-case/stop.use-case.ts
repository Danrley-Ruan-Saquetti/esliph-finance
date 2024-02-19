import { Injection, Service, Result } from '@core'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { JobRepository } from '@jobs/job.repository'

export const schemaBase = SchemaValidator.object({
    name: SchemaValidator.string({ 'required_error': 'Name is required' }).trim()
})

export type SchemaStopFiltersType = SchemaValidator.input<typeof schemaBase>

@Service({ name: 'job.use-case.stop' })
export class JobStopUseCase extends UseCase {
    constructor(
        @Injection.Inject('job.repository') private jobRepository: JobRepository,
    ) {
        super()
    }

    perform(args: SchemaStopFiltersType) {
        const { name } = this.validateDTO(args, schemaBase)

        const job = this.queryByName(name)

        job.stop()

        return Result.success({ message: `Job "${name}" successfully stopped` })
    }

    private queryByName(nameArgs: string) {
        const { name } = this.validateDTO({ name: nameArgs }, schemaBase)

        const result = this.jobRepository.findFirst({ where: { name } })

        if (!result.isSuccess()) {
            throw new BadRequestException({ ...result.getError() })
        }

        return result.getValue()
    }
}
