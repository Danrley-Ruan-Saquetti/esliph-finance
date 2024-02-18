import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO } from '@services/query-search/global'
import { QuerySearchService } from '@services/query-search.service'
import { SchemaValidator } from '@services/validator.service'
import { BlankRepository } from '@modules/blank/blank.repository'

const schemaNumber = SchemaValidator.coerce.number()

export const schemaQueryAdmin = GLOBAL_DTO.query.schema().extend({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'blank.use-case.query' })
export class BlankQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('blank.repository') private blankRepository: BlankRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        ])

        const result = await this.blankRepository.query({
            where: { ...filtersQuery },
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

        const blankResult = await this.blankRepository.findUnique({ where: { id } })

        if (!blankResult.isSuccess()) {
            return Result.failure({ ...blankResult.getError(), title: 'Query Blank' })
        }

        return Result.success(blankResult.getValue())
    }

    async queryMany() {
        const blanksResult = await this.blankRepository.findMany({})

        if (!blanksResult.isSuccess()) {
            return Result.failure({ ...blanksResult.getError(), title: 'Query Blanks' })
        }

        return Result.success(blanksResult.getValue() || [])
    }
}
