import { isUndefined, isString } from '@util'
import { SchemaValidator } from '@services/validator.service'
import { QueryType, QueryParamType, ParamOperation } from '@services/query-search/types'

export const GLOBAL_QUERY_SEARCH_HANDLER_VALUES = {
    [QueryType.STRING]: (filters: any, { type, excludesOperation = [] }: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) => {
        const filtersArgs = {
            ...(filters?.eq && !excludesOperation.includes('eq') && { equals: filters.eq }),
            ...(filters?.sw && !excludesOperation.includes('sw') && { startsWith: filters.sw }),
            ...(filters?.ew && !excludesOperation.includes('ew') && { endsWith: filters.ew }),
            ...(filters?.in && !excludesOperation.includes('in') && { contains: filters.in }),
            ...((filters?.nin || filters?.dif) && {
                not: {
                    ...(filters?.nin && !excludesOperation.includes('nin') && { contains: filters.nin }),
                    ...(filters?.dif && !excludesOperation.includes('dif') && { equals: filters.dif })
                }
            }),
            mode: 'insensitive',
        }

        if (Object.keys(filtersArgs).length == 1) {
            return {}
        }

        return filtersArgs
    },
    [QueryType.DATE]: (filters: any, { type, excludesOperation = [] }: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) => ({
        ...(filters?.eq && !excludesOperation.includes('eq') && { equals: filters.eq }),
        ...(filters?.gt && !excludesOperation.includes('gt') && { gt: filters.gt }),
        ...(filters?.lt && !excludesOperation.includes('lt') && { lt: filters.lt }),
        ...(filters?.gte && !excludesOperation.includes('gte') && { gte: filters.gte }),
        ...(filters?.lte && !excludesOperation.includes('lte') && { lte: filters.lte }),
        ...(filters?.dif && { not: { ...(!excludesOperation.includes('dif') && { equals: filters.dif }) } })
    }),
    [QueryType.NUMBER]: (filters: any, { type, excludesOperation = [] }: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) => ({
        ...(filters?.eq && !excludesOperation.includes('eq') && { equals: filters.eq }),
        ...(filters?.gt && !excludesOperation.includes('gt') && { gt: filters.gt }),
        ...(filters?.lt && !excludesOperation.includes('lt') && { lt: filters.lt }),
        ...(filters?.gte && !excludesOperation.includes('gte') && { gte: filters.gte }),
        ...(filters?.lte && !excludesOperation.includes('lte') && { lte: filters.lte }),
        ...(filters?.in && !excludesOperation.includes('in') && { in: filters.in }),
        ...((filters?.nin || filters?.dif) && {
            not: {
                ...(filters?.nin && !excludesOperation.includes('nin') && { in: filters.nin }),
                ...(filters?.dif && !excludesOperation.includes('dif') && { equals: filters.dif })
            }
        })
    }),
    [QueryType.BOOLEAN]: (filters: any, { type, excludesOperation = [] }: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) => ({
        ...(!isUndefined(filters?.eq) && !excludesOperation.includes('eq') && { equals: filters.eq }),
        ...(!isUndefined(filters?.dif) && { not: { ...(!excludesOperation.includes('dif') && { equals: filters.dif }) } }),
    }),
    ['ENUM']: (filters: any, { type, excludesOperation = [] }: { type: QueryParamType | 'ENUM', excludesOperation?: string[], }) => ({
        ...(!isUndefined(filters?.eq) && !excludesOperation.includes('eq') && { equals: filters.eq }),
        ...(!isUndefined(filters?.dif) && { not: { ...(!excludesOperation.includes('dif') && { equals: filters.dif }) } }),
    }),
}

export const GLOBAL_QUERY_SEARCH_DTO = {
    messageInvalid: (name: string, type: string, operator = '') => `Invalid ${type.toLowerCase()} to param "${name}${operator ? `.${operator}` : ''}"`,
    messageEnumInvalid: (values: string[], name: string, type: string, operator = '') => `Invalid enum to param "${name}${operator ? `.${operator}` : ''}". Expect "${values.join(', ')}"`,
}

export const QuerySearchHandlers = {
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
            .trim()
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
        SCHEMA: <T>(values: T, name: string) => ({
            [ParamOperation.CONTAINS]: QuerySearchHandlers['ENUM'].ARRAY_VALUES(values as any, name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers['ENUM'].ARRAY_VALUES(values as any, name, ParamOperation.NOT_CONTAINS).optional(),
        }),
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