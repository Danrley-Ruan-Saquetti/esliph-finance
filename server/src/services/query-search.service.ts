import { Service } from '@core'
import { GenericObject } from '@@types'
import { clearObject, createObjectByStringPath, insertValueInObjectByPath, isUndefined, mergeArrayObject } from '@util'
import { QueryParamType } from '@services/query-search/types'
import { GLOBAL_QUERY_SEARCH_HANDLER_VALUES } from '@services/query-search/global'

export type RelationMapQuery = {
    field: string,
    filter: string,
    type: QueryParamType | 'ENUM',
    excludesOperation?: string[],
    typeOperation: 'SCHEMA' | 'UNIQUE' | 'MANY_VALUES'
}

export type RelationMapOrderBy = {
    field: string,
    filter: string,
}

@Service({ name: 'global.service.query-search' })
export class QuerySearchService {

    createFilter(filtersArgs: GenericObject, relations: RelationMapQuery[]) {
        const filters = {}
        let AND: any[] = []

        for (const { field: fieldName, filter: filterName, type, typeOperation, excludesOperation } of relations) {
            const filter = filtersArgs[filterName]
            const value = typeOperation == 'SCHEMA' ? this.getFilterValuesInProp(filter, { type, excludesOperation }) : filter

            createObjectByStringPath(fieldName, filters)

            if (typeOperation == 'SCHEMA' && type == 'STRING') {
                if (!isUndefined(value.contains)) {
                    const newValue = value.contains.split(' ').map(word => {
                        const obj = createObjectByStringPath(fieldName)

                        insertValueInObjectByPath(obj, { contains: word, mode: 'insensitive' }, fieldName)

                        return obj
                    })

                    AND = [
                        ...AND,
                        ...newValue
                    ]

                    value.contains = undefined

                    if (Object.keys(value).length == 2 && value.mode) {
                        value.mode = undefined
                    }
                }
                if (!isUndefined(value.not) && !isUndefined(value.not.contains)) {
                    const newValue = value.not.contains.split(' ').map(word => {
                        const obj = createObjectByStringPath(`NOT.${fieldName}`)

                        insertValueInObjectByPath(obj, { contains: word, mode: 'insensitive' }, `NOT.${fieldName}`)

                        return obj
                    })

                    AND = [
                        ...AND,
                        ...newValue
                    ]

                    value.not.contains = undefined

                    if (Object.keys(value).length == 2 && value.mode) {
                        value.mode = undefined
                    }
                }
            }

            insertValueInObjectByPath(filters, value, fieldName)
        }

        return clearObject({ ...filters, AND })
    }

    createOrderBy(ordersByArgs: GenericObject[], relations: RelationMapOrderBy[], defaultOrdersBy: { [x: string]: 'asc' | 'desc' }[] = []) {
        const fullOrdersByArgs = mergeArrayObject(ordersByArgs)
        const ordersBy: GenericObject[] = []

        for (const { field: fieldName, filter: filterName } of relations) {
            if (isUndefined(fullOrdersByArgs[filterName])) {
                continue
            }

            const orderBy = createObjectByStringPath(filterName)
            insertValueInObjectByPath(orderBy, fullOrdersByArgs[filterName], fieldName)
            ordersBy.push(orderBy)
        }

        return [...ordersBy, ...defaultOrdersBy]
    }

    private getFilterValuesInProp(filters: any, options: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) {
        const handler = GLOBAL_QUERY_SEARCH_HANDLER_VALUES[options.type]

        if (!handler) {
            return {}
        }

        return handler(filters, options)
    }
}