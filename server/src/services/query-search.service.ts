import { Service } from '@core'
import { BadRequestException } from '@common/exceptions'
import { QuerySchema, QueryPayload, QueryType, ParamPayloadInput } from '@services/query-search/types'
import { HANDLER_TYPE_PARAM } from './query-search/helpers'
import { Json } from '@util'

@Service({ name: 'global.service.query-search' })
export class QuerySearchService {
    protected schema: QuerySchema
    protected paramsRequired: string[] = []

    parseFromString(queries: ParamPayloadInput) {
        return this.parseFromObject(Json.parse<QueryPayload>(queries).getValue())
    }

    parseFromObject(queries: QueryPayload) {
        const queriesFiltered = this.filterQueries(queries)
        const queriesValues = this.checkValuesQueries(queriesFiltered)

        return queriesValues
    }

    setSchema(schema: QuerySchema) {
        this.schema = schema
        this.paramsRequired = Object.keys(schema).filter(key => !schema[key].isOptional)
    }

    private filterQueries(queries: QueryPayload) {
        const queriesFiltered: QueryPayload = {}

        const paramIsRequiredAndNotInQueries = this.paramsRequired.find(paramName => !queries[paramName])

        if (this.paramsRequired && this.paramsRequired.find(paramName => !queries[paramName])) {
            throw new BadRequestException({ title: 'Query Param', message: `Param "${paramIsRequiredAndNotInQueries}" is required` })
        }

        for (const paramName in queries) {
            const filter = queries[paramName] as QueryPayload[typeof paramName]
            const filterSchema = this.schema[paramName]

            if (!filterSchema) {
                continue
            }

            queriesFiltered[paramName] = filter
        }

        return queriesFiltered
    }

    private checkValuesQueries(queries: QueryPayload) {
        const queriesValues: QueryPayload = {}

        for (const paramName in queries) {
            const filter = this.schema[paramName]

            queriesValues[paramName] = HANDLER_TYPE_PARAM[filter.type](queries[paramName], paramName, filter)
        }

        return queriesValues
    }
}

const schema: QuerySchema = {
    limite: {
        type: QueryType.NUMBER,
        isOptional: true,
        // uniqueValue: true
    },
    pageIndex: {
        type: QueryType.NUMBER,
        isOptional: true,
        uniqueValue: true
    },
}

const querySearch = new QuerySearchService()

querySearch.setSchema(schema)
console.log(querySearch)

const searchParams: QueryPayload = {
    limite: {
        dif: ''
    },
}

const search = querySearch.parseFromString(Json.toJSON(searchParams).getValue())

console.log(search)