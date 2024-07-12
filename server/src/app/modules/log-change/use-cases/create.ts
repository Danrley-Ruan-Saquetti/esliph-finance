import { isArray } from '@util/types'
import { z, Validator } from '@services/validator'
import { ChangeLogModel } from '@modules/log-change/model'
import { GLOBAL_LOG_DTO } from '@modules/log-change/global'

const { changeLogRepository } = ChangeLogModel

const schemaCreate = z.object({
    recordId: z
        .coerce
        .number()
        .int(),
    entity: z
        .string()
        .trim(),
    dateTime: z
        .date()
        .nullish()
        .transform(date => date || new Date(Date.now())),
    data: z.union([
        z.array(
            z.any({ 'required_error': GLOBAL_LOG_DTO.data.messageRequired })
        ),
        z.any({ 'required_error': GLOBAL_LOG_DTO.data.messageRequired })
    ])
        .transform(data => isArray(data) ? data : [data])
})

export type ChangeLogCreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: ChangeLogCreateDTOArgs) {
    const { data, dateTime, entity, recordId } = Validator.parseNoSafe(args, schemaCreate)

    await changeLogRepository.create({
        data: {
            recordId,
            entity,
            data,
            dateTime,
        }
    })

    return { message: 'Log change created successfully' }
}