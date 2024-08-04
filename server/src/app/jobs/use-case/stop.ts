import { z, Validator } from '@services/validator'
import { jobRepository } from '@repositories/job'

export const schemaBase = z.object({
    name: z.string({ 'required_error': 'Name is required' }).trim()
})

export type JobStopArgs = z.input<typeof schemaBase>

export function stop(args: JobStopArgs) {
    const { name } = Validator.parseNoSafe(args, schemaBase)

    const job = jobRepository.findFirst({ where: { name } })

    job.stop()

    return { message: `Job "${name}" successfully stopped` }
}