import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO } from '@services/query-search/global'
import { QuerySearchService } from '@services/query-search.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'

const schemaNumber = ValidatorService.schema.coerce.number()

export const schemaQueryAdmin = ValidatorService.schema.object({
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    value: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('value')).optional(),
    discount: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('discount')).optional(),
    increase: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('increase')).optional(),
    paidAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('paidAt')).optional(),
    createdAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
    transaction: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('transaction')).optional(),
    transactionId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('transactionId')).optional(),
    transactionValue: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('transactionValue')).optional(),
    transactionSituation: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.enum, 'transactionSituation')).optional(),
    peopleId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    people: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('people')).optional(),
    peopleType: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_PEOPLE_DTO.type.enum, 'peopleType')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'payment.use-case.query' })
export class PaymentQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('payment.repository') private paymentRepository: PaymentRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'value', filter: 'value', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'discount', filter: 'discount', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'increase', filter: 'increase', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'paidAt', filter: 'paidAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'createAt', filter: 'createAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.id', filter: 'transactionId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.title', filter: 'transaction', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.value', filter: 'transactionValue', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.situation', filter: 'transactionSituation', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.bankAccount.people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.bankAccount.people.name', filter: 'people', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.bankAccount.people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'financialTransaction.bankAccount.people.type', filter: 'peopleType', type: 'ENUM', typeOperation: 'SCHEMA' },
        ])

        const result = await this.paymentRepository.query({
            where: { ...filtersQuery },
            include: { financialTransaction: true }
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
        })
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const paymentResult = await this.paymentRepository.findUnique({ where: { id } })

        if (!paymentResult.isSuccess()) {
            return Result.failure({ ...paymentResult.getError(), title: 'Query Payment' })
        }

        return Result.success(paymentResult.getValue())
    }
}
