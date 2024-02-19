import { Injection, Service, Result } from '@core'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { JobRepository } from '@jobs/job.repository'

export const schemaBase = SchemaValidator.object({
    name: SchemaValidator.string({ 'required_error': 'Name is required' }).trim()
})

export type SchemaExecuteFiltersType = SchemaValidator.input<typeof schemaBase>

@Service({ name: 'job.use-case.execute' })
export class JobExecuteUseCase extends UseCase {
    constructor(
        @Injection.Inject('job.repository') private jobRepository: JobRepository,
    ) {
        super()
    }

    perform(args: SchemaExecuteFiltersType) {
        const { name } = this.validateDTO(args, schemaBase)

        const job = this.queryByName(name)

        job.execute()

        return Result.success({ message: `Job "${name}" successfully executed` })
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
