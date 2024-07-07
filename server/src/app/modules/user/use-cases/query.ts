import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { UserModel } from '@modules/user/model'

const { userRepository } = UserModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'active', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
        { field: 'code', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'login', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'people', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'type' },
        { field: 'active' },
        { field: 'code' },
        { field: 'login' },
        { field: 'createdAt' },
        { field: 'peopleId' },
        { field: 'people' },
        { field: 'itinCnpj' },
    ],
    [{ id: 'desc' }]
)

const schemaQuery = DTO.query.schema().extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    type: z.object(QuerySearchDTO['ENUM']['SCHEMA']('type')).optional(),
    code: z.object(QuerySearchDTO['STRING']['SCHEMA']('code')).optional(),
    login: z.object(QuerySearchDTO['STRING']['SCHEMA']('login')).optional(),
    createdAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
    active: z.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('active')).optional(),
    peopleId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    people: z.object(QuerySearchDTO['STRING']['SCHEMA']('people')).optional(),
    itinCnpj: z.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const users = await userRepository.query({
        where: { ...filters },
        orderBy: [...orderBy]
    }, resultDTO)

    return users
}