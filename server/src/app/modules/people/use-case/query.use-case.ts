import { Injection, Result, Service } from '@core'
import { UseCase } from '@common/use-case'
import { GLOBAL_DTO } from '@global'
import { QuerySearchDTO } from '@services/query-search/global'
import { SchemaValidator } from '@services/validator.service'
import { PeopleRepository } from '@modules/people/people.repository'
import { QuerySearchService } from '@services/query-search.service'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'

export const schemaQueryAdmin = GLOBAL_DTO.query.schema(['id', 'name', 'itinCnpj', 'type', 'gender', 'dateOfBirth', 'active', 'createdAt']).extend({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    name: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('name')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    type: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_PEOPLE_DTO.type.enum, 'type')).optional(),
    gender: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_PEOPLE_DTO.gender.enum, 'gender')).optional(),
    dateOfBirth: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('dateOfBirth')).optional(),
    active: SchemaValidator.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('active')).optional(),
    createdAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'people.use-case.query' })
export class PeopleQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('people.repository') private peopleRepository: PeopleRepository,
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
            { field: 'itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'active', filter: 'active', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
            { field: 'gender', filter: 'gender', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'dateOfBirth', filter: 'dateOfBirth', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'createdAt', filter: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
        ])

        const ordersByQuery = this.querySearch.createOrderBy(filters.orderBy, [
            { field: 'id', filter: 'id' },
            { field: 'name', filter: 'name' },
            { field: 'itinCnpj', filter: 'itinCnpj' },
            { field: 'type', filter: 'type' },
            { field: 'active', filter: 'active' },
            { field: 'gender', filter: 'gender' },
            { field: 'dateOfBirth', filter: 'dateOfBirth' },
            { field: 'createdAt', filter: 'createdAt' },
        ], [{ id: 'desc' }])

        const result = await this.peopleRepository.query({
            where: { ...filtersQuery },
            orderBy: [...ordersByQuery]
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
        })
    }
}
