import { z, Validator } from '@services/validator'
import { jobRepository } from '@repositories/job'

export const schemaBase = z.object({
    name: z.string({ 'required_error': 'Name is required' }).trim()
})

export type JobStartArgs = z.input<typeof schemaBase>

export function start(args: JobStartArgs) {
    const { name } = Validator.parseNoSafe(args, schemaBase)

    const job = jobRepository.findFirst({ where: { name } })

    job.start()

    return { message: `Job "${name}" successfully started` }
}