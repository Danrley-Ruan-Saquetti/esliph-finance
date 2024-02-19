import { Injection, Service, Result } from '@core'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO } from '@services/query-search/global'
import { SchemaValidator } from '@services/validator.service'
import { QuerySearchService } from '@services/query-search.service'
import { JobRepository } from '@jobs/job.repository'

export const schemaBase = SchemaValidator.object({
    name: QuerySearchDTO['STRING']['UNIQUE']('name')
})

export const schemaQueryAdmin = GLOBAL_DTO.query.schema(['name']).extend({
    name: QuerySearchDTO['STRING']['UNIQUE']('name').optional()
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'job.use-case.query' })
export class JobQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('job.repository') private jobRepository: JobRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'name', filter: 'name', type: 'STRING', typeOperation: 'UNIQUE' },
        ])

        const ordersByQuery = this.querySearch.createOrderBy(filters.orderBy, [
            { field: 'name', filter: 'name' },
        ], [{ name: 'desc' }])

        const result = this.jobRepository.query({
            where: { ...filtersQuery as any },
            orderBy: { ...ordersByQuery as any }
        }, filters)

        return Result.success(result)
    }

    queryByName(nameArgs: string) {
        const { name } = this.validateDTO({ name: nameArgs }, schemaBase)

        const result = this.jobRepository.findFirst({ where: { name } })

        return result
    }
}
