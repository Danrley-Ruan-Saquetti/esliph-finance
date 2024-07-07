import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { MonetaryValue } from '@services/monetary-value'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { PaymentModel } from '@modules/payment/model'

const { paymentRepository } = PaymentModel

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'financialTransactionId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'valuePaid', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'discount', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'increase', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'paidAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { filter: 'financialTransaction.title', field: 'financialTransaction', type: 'STRING', typeOperation: 'SCHEMA' },
        { filter: 'financialTransaction.value', field: 'financialTransactionValue', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { filter: 'financialTransaction.bankAccount.id', field: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { filter: 'financialTransaction.bankAccount.name', field: 'bankAccount', type: 'STRING', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'financialTransactionId' },
        { field: 'valuePaid' },
        { field: 'discount' },
        { field: 'increase' },
        { field: 'paidAt' },
        { field: 'createdAt' },
        { field: 'financialTransaction' },
        { field: 'financialTransactionValue' },
        { field: 'bankAccountId' },
        { field: 'bankAccount' },
    ],
    [{ paidAt: 'desc' }, { id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['id', 'name', 'itinCnpj', 'type', 'active', 'gender', 'dateOfBirth', 'createdAt'] }).extend({
    id: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    financialTransactionId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    valuePaid: z.object(QuerySearchDTO['NUMBER_MONETARY']['SCHEMA']('valuePaid')).optional(),
    discount: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    increase: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    paidAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('id')).optional(),
    createdAt: z.object(QuerySearchDTO['DATE']['SCHEMA']('id')).optional(),
    financialTransaction: z.object(QuerySearchDTO['STRING']['SCHEMA']('id')).optional(),
    financialTransactionValue: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccount: z.object(QuerySearchDTO['STRING']['SCHEMA']('id')).optional(),
    bankAccountId: z.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function query(args: QueryDTOArgs) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const payments = await paymentRepository.query({
        where: { ...filters },
        orderBy: [...orderBy],
    }, resultDTO)

    return payments.payments.map(payment => {
        return {
            ...payment,
            valuePaid: MonetaryValue.toReal(payment.valuePaid),
            discount: MonetaryValue.toReal(payment.discount),
            increase: MonetaryValue.toReal(payment.increase),
        }
    })
}