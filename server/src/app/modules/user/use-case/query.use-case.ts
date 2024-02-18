import { Injection, Service, Result } from '@core'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchService } from '@services/query-search.service'
import { QuerySearchDTO } from '@services/query-search/global'
import { SchemaValidator } from '@services/validator.service'
import { PeopleModel } from '@modules/people/people.model'
import { UserRepository } from '@modules/user/user.repository'
import { UserModel } from '@modules/user/user.model'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'

const schemaNumber = SchemaValidator.coerce.number()

const schemaQueryAdmin = GLOBAL_DTO.query.schema(['id', 'type', 'code', 'login', 'createdAt', 'active', 'peopleId', 'people', 'itinCnpj']).extend({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    type: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_USER_DTO.type.enum, 'type')).optional(),
    code: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('code')).optional(),
    login: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('login')).optional(),
    createdAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
    active: SchemaValidator.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('active')).optional(),
    peopleId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    people: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('people')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'user.use-case.query' })
export class UserQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'code', filter: 'code', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'login', filter: 'login', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'createdAt', filter: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'active', filter: 'active', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
            { field: 'people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'people.name', filter: 'people', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
        ])

        const ordersByQuery = this.querySearch.createOrderBy(filters.orderBy, [
            { field: 'id', filter: 'id' },
            { field: 'type', filter: 'type' },
            { field: 'code', filter: 'code' },
            { field: 'login', filter: 'login' },
            { field: 'createdAt', filter: 'createdAt' },
            { field: 'active', filter: 'active' },
            { field: 'people.name', filter: 'people' },
            { field: 'people.id', filter: 'peopleId' },
            { field: 'people.itinCnpj', filter: 'itinCnpj' },
        ], [{ id: 'desc' }])

        const result = await this.userRepository.query({
            where: { ...filtersQuery },
            select: { ...UserModel.UserWithoutPasswordSelect, people: { select: { ...PeopleModel.PeopleSimpleSelect } } },
            orderBy: [...ordersByQuery]
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue()
        })
    }

    async queryByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findUnique({ where: { id }, select: UserModel.UserWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query User' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryWithPeopleByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findUnique({ where: { id }, select: { ...UserModel.UserWithoutPasswordSelect, active: false, people: { select: { ...PeopleModel.PeopleSimpleSelect, active: false } } } })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query User' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyWithPeopleWithoutPassword() {
        const bankAccountResult = await this.userRepository.findMany({ where: {}, select: { ...UserModel.UserWithoutPasswordSelect, active: false, people: { select: { ...PeopleModel.PeopleSimpleSelect, active: false } } } })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query User' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
