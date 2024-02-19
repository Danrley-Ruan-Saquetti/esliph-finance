import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO } from '@services/query-search/global'
import { QuerySearchService } from '@services/query-search.service'
import { SchemaValidator } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'

const schemaNumber = SchemaValidator.coerce.number()

export const schemaQueryAdmin = GLOBAL_DTO.query.schema(['id', 'peopleId', 'peopleName', 'peopleType', 'itinCnpj', 'name', 'code', 'balance', 'createdAt']).extend({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    peopleId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    peopleName: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('peopleName')).optional(),
    peopleType: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_PEOPLE_DTO.type.enum, 'peopleType')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    name: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('name')).optional(),
    code: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('code')).optional(),
    balance: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('balance')).optional(),
    createdAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase extends UseCase {
    private static MASK_PROPS = {
        code: GLOBAL_BANK_ACCOUNT_DTO.code.maskData,
        balance: GLOBAL_BANK_ACCOUNT_DTO.balance.maskData,
    }

    constructor(
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'name', filter: 'name', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'code', filter: 'code', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'balance', filter: 'balance', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'createdAt', filter: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'people.name', filter: 'peopleName', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'people.type', filter: 'peopleType', type: 'ENUM', typeOperation: 'SCHEMA' },
        ])

        const ordersByQuery = this.querySearch.createOrderBy(filters.orderBy, [
            { field: 'id', filter: 'id' },
            { field: 'people.id', filter: 'peopleId' },
            { field: 'people.name', filter: 'peopleName' },
            { field: 'people.type', filter: 'peopleType' },
            { field: 'people.itinCnpj', filter: 'itinCnpj' },
            { field: 'name', filter: 'name' },
            { field: 'code', filter: 'code' },
            { field: 'balance', filter: 'balance' },
            { field: 'createdAt', filter: 'createdAt' },
        ], [{ id: 'desc' }])

        const result = await this.bankAccountRepository.query({
            where: { ...filtersQuery },
            select: { ...BankAccountModel.BankAccountWithoutPasswordSelect, people: true },
            orderBy: [...ordersByQuery]
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
        })
    }

    async queryByIdWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByIdCodeMaskWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByIdCodeMaskWithoutPasswordWhitMask(args: { id: ID }, options: { masks?: (keyof BankAccountModel.BankAccountWithoutPassword)[] } = {}) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByCodeWithoutPassword({ code }: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { code }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByCodeWithoutPasswordWithMask({ code }: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { code }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByPeopleIdWithoutPassword(args: { peopleId: ID }) {
        const peopleId = this.validateDTO(args.peopleId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findMany({ where: { peopleId }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword[]>({ ...bankAccountsResult.getError(), title: 'Query Bank Accounts' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByPeopleIdWithoutPasswordAndBalance(args: { peopleId: ID }) {
        const peopleId = this.validateDTO(args.peopleId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findMany({ where: { peopleId }, select: BankAccountModel.BankAccountWithoutPasswordAndBalanceSelect })

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>({
                ...bankAccountsResult.getError(),
                title: 'Query Bank Accounts',
            })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }
}
