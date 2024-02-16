import { SchemaValidator } from '@services/validator.service'
import { Service } from '@core'
import { Json, clearObject, isString, isUndefined } from '@util'
import { BadRequestException } from '@common/exceptions'
import { HANDLER_TYPE_PARAM } from '@services/query-search/helpers'
import { QuerySchema, QueryPayload, ParamPayloadInput, ParamOperation, QueryType, QueryParamType } from '@services/query-search/types'

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

            let value: any = filter

            if (isString(value)) {
                const valueResult = Json.parse(value as string)

                if (!valueResult.isSuccess()) {
                    throw new BadRequestException({ title: 'Param Invalid', message: `Invalid ${filterSchema.type.toLowerCase()} to param "${paramName}}"` })
                }

                value = valueResult.getValue()
            }

            queriesFiltered[paramName] = value
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

const GLOBAL_QUERY_SEARCH_DTO = {
    messageInvalid: (name: string, type: string, operator = '') => `Invalid ${type.toLowerCase()} to param "${name}${operator ? `.${operator}` : ''}"`,
    messageEnumInvalid: (values: string[], name: string, type: string, operator = '') => `Invalid enum to param "${name}${operator ? `.${operator}` : ''}". Expect "${values.join(', ')}"`,
}

const QuerySearchHandlers = {
    ENUM: {
        UNIQUE_VALUE: <T extends Readonly<[string, ...string[]]>>(enumValue: T, name: string, operator?: string) => SchemaValidator
            .enum(enumValue, {
                errorMap: () => ({ message: GLOBAL_QUERY_SEARCH_DTO.messageEnumInvalid(enumValue as any, name, 'enum', operator) }),
            }),
        ARRAY_VALUES: <T extends Readonly<[string, ...string[]]>>(enumValue: T, name: string, operator?: string) => SchemaValidator
            .array(
                SchemaValidator
                    .enum(enumValue, {
                        errorMap: () => ({ message: GLOBAL_QUERY_SEARCH_DTO.messageEnumInvalid(enumValue as any, name, 'array enum', operator) }),
                    })
            ),
    },
    [QueryType.NUMBER]: {
        UNIQUE_VALUE: (name: string, operator?: string) => SchemaValidator
            .coerce
            .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'number', operator) }),
        ARRAY_VALUES: (name: string, operator?: string) => SchemaValidator
            .array(
                SchemaValidator
                    .coerce
                    .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }),
                { 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }
            )
    },
    [QueryType.BOOLEAN]: {
        UNIQUE_VALUE: (name: string, operator?: string) => SchemaValidator
            .boolean({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'boolean', operator) })
    },
    [QueryType.STRING]: {
        UNIQUE_VALUE: (name: string, operator?: string) => SchemaValidator
            .coerce
            .string({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'string', operator) })
            .transform(val => isString(val) && val.length > 0 ? val : undefined)
    },
    [QueryType.DATE]: {
        UNIQUE_VALUE: (name: string, operator?: string) => SchemaValidator
            .coerce
            .date({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'date', operator) }),
    },
}

export const QuerySearchDTO = {
    ENUM: {
        UNIQUE: <T>(values: T, name: string) => QuerySearchHandlers['ENUM'].UNIQUE_VALUE(values as any, name),
        MANY_VALUES: <T>(values: T, name: string) => QuerySearchHandlers['ENUM'].ARRAY_VALUES(values as any, name),
    },
    [QueryType.NUMBER]: {
        UNIQUE: (name: string) => QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name),
        MANY_VALUES: (name: string) => QuerySearchHandlers[QueryType.NUMBER].ARRAY_VALUES(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers[QueryType.NUMBER].ARRAY_VALUES(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers[QueryType.NUMBER].ARRAY_VALUES(name, ParamOperation.NOT_CONTAINS).optional(),
            [ParamOperation.GREATER_THAN]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN).optional(),
            [ParamOperation.GREATER_THAN_OR_EQUAL]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN_OR_EQUAL).optional(),
            [ParamOperation.LESS_THAN]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN).optional(),
            [ParamOperation.LESS_THAN_OR_EQUAL]: QuerySearchHandlers[QueryType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN_OR_EQUAL).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    [QueryType.BOOLEAN]: {
        UNIQUE: (name: string) => QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    [QueryType.STRING]: {
        UNIQUE: (name: string) => QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.NOT_CONTAINS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
            [ParamOperation.STARS_WITH]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.STARS_WITH).optional(),
            [ParamOperation.ENDS_WITH]: QuerySearchHandlers[QueryType.STRING].UNIQUE_VALUE(name, ParamOperation.ENDS_WITH).optional(),
        }),
    },
    [QueryType.DATE]: {
        UNIQUE: (name: string) => QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.GREATER_THAN]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN).optional(),
            [ParamOperation.GREATER_THAN_OR_EQUAL]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN_OR_EQUAL).optional(),
            [ParamOperation.LESS_THAN]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.LESS_THAN).optional(),
            [ParamOperation.LESS_THAN_OR_EQUAL]: QuerySearchHandlers[QueryType.DATE].UNIQUE_VALUE(name, ParamOperation.LESS_THAN_OR_EQUAL).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[QueryType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
}

export function CreateFilter(
    filtersArgs: { [x: string]: any },
    relations: {
        field: string,
        filter: string,
        type: QueryParamType | 'ENUM',
        excludesOperation?: string[],
        typeOperation: 'SCHEMA' | 'UNIQUE' | 'MANY_VALUES'
    }[]) {
    const filters = {}

    for (const { field, filter, type, typeOperation, excludesOperation } of relations) {
        const routers = field.split('.')
        let currentObj = filters

        for (let i = 0; i < routers.length; i++) {
            const router = routers[i]

            if (i == routers.length - 1) {
                if (!isUndefined(filtersArgs[filter])) {
                    const value = getFilterValuesInProp(filtersArgs[filter], { type, typeOperation, excludesOperation })

                    currentObj[router] = value
                }
            } else {
                currentObj[router] = {}
            }

            if (!isUndefined(currentObj[router])) {
                currentObj = currentObj[router]
            }
        }
    }

    return clearObject(filters)
}

function getFilterValuesInProp(filters: any, { type, typeOperation, excludesOperation = [] }: {
    type: QueryParamType | 'ENUM',
    excludesOperation?: string[],
    typeOperation: 'SCHEMA' | 'UNIQUE' | 'MANY_VALUES'
}) {
    switch (type) {
        case 'BOOLEAN': {
            if (typeOperation == 'UNIQUE') {
                return filters
            }
            if (typeOperation == 'MANY_VALUES') {
                return filters
            }
            return {
                ...(!excludesOperation.includes('eq') && { equals: filters?.eq }),
                not: {
                    ...(!excludesOperation.includes('dif') && { equals: filters?.dif })
                },
            }
        }
        case 'DATE': {
            if (typeOperation == 'UNIQUE') {
                return filters
            }
            if (typeOperation == 'MANY_VALUES') {
                return filters
            }
            return {
                ...(!excludesOperation.includes('eq') && { equals: filters?.eq }),
                ...(!excludesOperation.includes('gt') && { gt: filters?.gt }),
                ...(!excludesOperation.includes('lt') && { lt: filters?.lt }),
                ...(!excludesOperation.includes('gte') && { gte: filters?.gte }),
                ...(!excludesOperation.includes('lte') && { lte: filters?.lte }),
                not: { ...(!excludesOperation.includes('dif') && { equals: filters?.dif }) }
            }
        }
        case 'ENUM': {
            if (typeOperation == 'UNIQUE') {
                return filters
            }
            if (typeOperation == 'MANY_VALUES') {
                return filters
            }
            return {
                ...(!excludesOperation.includes('in') && { in: filters })
            }
        }
        case 'NUMBER': {
            if (typeOperation == 'UNIQUE') {
                return filters
            }
            if (typeOperation == 'MANY_VALUES') {
                return filters
            }
            return {
                ...(!excludesOperation.includes('eq') && { equals: filters?.eq }),
                ...(!excludesOperation.includes('gt') && { gt: filters?.gt }),
                ...(!excludesOperation.includes('lt') && { lt: filters?.lt }),
                ...(!excludesOperation.includes('gte') && { gte: filters?.gte }),
                ...(!excludesOperation.includes('lte') && { lte: filters?.lte }),
                ...(!excludesOperation.includes('in') && { in: filters?.in }),
                not: {
                    ...(!excludesOperation.includes('nin') && { in: filters?.nin }),
                    ...(!excludesOperation.includes('dif') && { equals: filters?.dif })
                }
            }
        }
        case 'STRING': {
            if (typeOperation == 'UNIQUE') {
                return filters
            }
            if (typeOperation == 'MANY_VALUES') {
                return filters
            }
            return {
                ...(!excludesOperation.includes('eq') && { equals: filters?.eq }),
                ...(!excludesOperation.includes('sw') && { startsWith: filters?.sw }),
                ...(!excludesOperation.includes('ew') && { endsWith: filters?.ew }),
                ...(!excludesOperation.includes('in') && { contains: filters?.in }),
                not: {
                    ...(!excludesOperation.includes('nin') && { contains: filters?.nin }),
                    ...(!excludesOperation.includes('dif') && { equals: filters?.dif })
                },
                mode: 'insensitive',
            }
        }
        default:
            return undefined
    }
}

const result = CreateFilter(
    {
        limite: 3,
        pageIndex: 0,
        bankAccountId: {},
        categoryId: {},
        title: { in: 'Primeira' },
        id: { in: [4, 5] },
        competenceAt: { gt: '2024-01-12 14:55:00' },
        frequency: ['DAILY'],
    },
    [
        { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'expiresIn', filter: 'expiresAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'dateTimeCompetence', filter: 'competenceAt', type: 'DATE', typeOperation: 'SCHEMA' },
        { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'MANY_VALUES' },
        { field: 'typeOccurrence', filter: 'typeOccurrence', type: 'ENUM', typeOperation: 'MANY_VALUES' },
        { field: 'frequency.in', filter: 'frequency', type: 'ENUM', typeOperation: 'MANY_VALUES', excludesOperation: ['in'] },
        { field: 'categories.some.category.id', filter: 'categoryId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'categories.some.category.name', filter: 'category', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'bankAccount.people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
    ]
)

console.log(result)
