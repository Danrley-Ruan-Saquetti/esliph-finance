import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { PeopleModel } from '@modules/people/model'
import { FormatterItinCnpj } from '@services/formatter-itin-cnpj'

const { peopleRepository } = PeopleModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'name', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'active', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
        { field: 'gender', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'dateOfBirth', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'name' },
        { field: 'itinCnpj' },
        { field: 'type' },
        { field: 'active' },
        { field: 'gender' },
        { field: 'dateOfBirth' },
        { field: 'createdAt' },
    ],
    [{ id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['id', 'name', 'itinCnpj', 'type', 'active', 'gender', 'dateOfBirth', 'createdAt'] }).extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    name: z.object(QuerySearchDTO['STRING']['SCHEMA']('name')).optional(),
    itinCnpj: z.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    type: z.object(QuerySearchDTO['ENUM']['SCHEMA']('type')).optional(),
    active: z.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('active')).optional(),
    gender: z.object(QuerySearchDTO['ENUM']['SCHEMA']('gender')).optional(),
    dateOfBirth: z.object(QuerySearchDTO['DATE']['SCHEMA']('dateOfBirth')).optional(),
    createdAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const peoples = await peopleRepository.query({
        where: { ...filters },
        orderBy: [...orderBy],
    }, resultDTO)

    return {
        ...peoples,
        peoples: peoples.peoples.map(people => {
            return {
                ...people,
                itinCnpj: FormatterItinCnpj.formatItinCnpj(people.itinCnpj),
            }
        })
    }
}