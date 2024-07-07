import { ID } from '@@types'
import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { CategoryModel } from '@modules/category/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { categoryRepository } = CategoryModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'name', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'color', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'isFavorite', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'bankAccountId' },
        { field: 'name' },
        { field: 'color' },
        { field: 'type' },
        { field: 'isFavorite' },
        { field: 'createdAt' },
    ],
    [{ isFavorite: 'desc' }, { id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['id', 'bankAccountId', 'name', 'color', 'type', 'isFavorite', 'createdAt'] }).extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccountId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('bankAccountId')).optional(),
    name: z.object(QuerySearchDTO['STRING']['SCHEMA']('name')).optional(),
    color: z.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    isFavorite: z.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('active')).optional(),
    createdAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const categories = await categoryRepository.query({
        where: { ...filters },
        orderBy: [...orderBy],
    }, resultDTO)

    return categories.categories
}

export async function simpleQuery({ bankAccountId, name }: { bankAccountId: ID, name: string }) {
    bankAccountId = Validator.parseNoSafe(bankAccountId, GLOBAL_BANK_ACCOUNT_DTO.id)
    name = name.trim().replace(/\s{2,}/g, ' ')

    if (!name)
        return { categories: [] }

    const categories = await categoryRepository.findMany({
        where: {
            bankAccountId,
            AND: name.split(' ').map(letter => ({
                name: { contains: letter, mode: 'insensitive' }
            }))
        },
        select: {
            id: true,
            name: true,
            color: true,
            isFavorite: true,
            createdAt: true,
            updatedAt: true,
        },
        take: 15
    })

    return { categories }
}