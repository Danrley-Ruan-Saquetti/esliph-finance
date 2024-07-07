import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { CompensationPaymentManager } from '@modules/payment/financial-transaction/manager/compensation-payment'

const { financialTransactionRepository } = FinancialTransactionModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'title', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'senderRecipient', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'expiresIn', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'dateTimeCompetence', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'value', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'typeOccurrence', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'situation', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'frequency', type: 'ENUM', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.name', filter: 'bankAccount', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.code', filter: 'bankAccountCode', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.people.id', filter: 'peopleId', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.people.name', filter: 'people', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'categories.some.category.name', filter: 'category', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'categories.some.category.id', filter: 'categoryId', type: 'STRING', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'title' },
        { field: 'senderRecipient' },
        { field: 'expiresIn' },
        { field: 'dateTimeCompetence' },
        { field: 'value' },
        { field: 'type' },
        { field: 'typeOccurrence' },
        { field: 'situation' },
        { field: 'frequency' },
        { field: 'bankAccountId' },
        { field: 'bankAccount' },
        { field: 'bankAccountCode' },
        { field: 'peopleId' },
        { field: 'itinCnpj' },
        { field: 'people' },
        { field: 'category' },
        { field: 'categoryId' },
    ],
    [{ expiresIn: 'asc' }, { id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['id', 'title', 'senderRecipient', 'expiresIn', 'dateTimeCompetence', 'type', 'typeOccurrence', 'situation', 'frequency', 'bankAccountId', 'bankAccount', 'bankAccountCode', 'peopleId', 'itinCnpj', 'people', 'category', 'categoryId'] }).extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccountId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('bankAccountId')).optional(),
    bankAccount: z.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccount')).optional(),
    bankAccountCode: z.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccountCode')).optional(),
    value: z.object(QuerySearchDTO['NUMBER_MONETARY']['SCHEMA']('value')).optional(),
    category: z.object(QuerySearchDTO['STRING']['SCHEMA']('category')).optional(),
    categoryId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('categoryId')).optional(),
    title: z.object(QuerySearchDTO['STRING']['SCHEMA']('title')).optional(),
    peopleId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    people: z.object(QuerySearchDTO['STRING']['SCHEMA']('people')).optional(),
    senderRecipient: z.object(QuerySearchDTO['STRING']['SCHEMA']('senderRecipient')).optional(),
    itinCnpj: z.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    expiresAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('expiresAt')).optional(),
    competenceAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('competenceAt')).optional(),
    type: z.object(QuerySearchDTO['ENUM']['SCHEMA']('type')).optional(),
    situation: z.object(QuerySearchDTO['ENUM']['SCHEMA']('situation')).optional(),
    frequency: z.object(QuerySearchDTO['ENUM']['SCHEMA']('frequency')).optional(),
    typeOccurrence: z.object(QuerySearchDTO['ENUM']['SCHEMA']('typeOccurrence')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const financialTransactions = await financialTransactionRepository.query({
        where: { ...filters },
        include: {
            payments: true, categories: {
                select: {
                    category: true
                },
                orderBy: [
                    { category: { isFavorite: 'desc' } },
                    { category: { id: 'desc' } },
                ]
            }
        },
        orderBy: [...orderBy]
    }, resultDTO)

    return {
        ...financialTransactions,
        financialTransactions: financialTransactions.financialTransactions.map(({ payments, ...financialTransaction }) => {
            const compensationManager = new CompensationPaymentManager(financialTransaction, payments)

            return {
                ...financialTransaction,
                categories: financialTransaction.categories.map(({ category }) => category),
                compensation: compensationManager.getPaymentStatementInReal(),
            }
        })
    }
}