import { z, Validator } from '@services/validator'
import { jobRepository } from '@repositories/job'

export const schemaBase = z.object({
    name: z.string({ 'required_error': 'Name is required' }).trim()
})

export type JobExecuteArgs = z.input<typeof schemaBase>

export function execute(args: JobExecuteArgs) {
    const { name } = Validator.parseNoSafe(args, schemaBase)

    const job = jobRepository.findFirst({ where: { name } })

    job.execute()

    return { message: `Job "${name}" successfully executed` }
}