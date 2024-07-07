import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { NoteModel } from '@modules/note/model'
import { QuerySearchDTO } from '@services/query-builder/schema'

const { noteRepository } = NoteModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'description', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { filter: 'financialTransaction.financialTransactionId', field: 'financialTransactionId', type: 'NUMBER', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'description' },
        { field: 'createdAt' },
        { field: 'financialTransactionId' },
    ],
    [{ id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['id', 'description', 'createdAt', 'financialTransactionId'] }).extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    financialTransactionId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    description: z.object(QuerySearchDTO['STRING']['SCHEMA']('id')).optional(),
    createdAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('id')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const notes = await noteRepository.query({
        where: { ...filters },
        orderBy: [...orderBy],
    }, resultDTO)

    return notes
}