import { z } from '@services/validator'
import { isString } from '@util/types'
import { DTO } from '@util/dto'
import { MonetaryValue } from '@services/monetary-value'
import { ParamType, ParamOperation } from '@services/query-builder/types'

const GLOBAL_QUERY_SEARCH_DTO = {
    messageInvalid: (name: string, type: string, operator = '') => `Invalid ${type.toLowerCase()} to param "${name}${operator ? `.${operator}` : ''}"`,
    messageEnumInvalid: (values: string[], name: string, type: string, operator = '') => `Invalid ${type.toLowerCase()} to param "${name}${operator ? `.${operator}` : ''}". Expect "${values.join('", "')}"`,
}

export const QuerySearchHandlers = {
    [ParamType.ENUM]: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .coerce
            .string({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'string', operator) })
            .trim()
            .transform(val => isString(val) && val.length > 0 ? DTO.text.transform(val) : undefined),
        ARRAY_VALUES: (name: string, operator?: string) => z
            .array(
                z
                    .coerce
                    .string({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'string', operator) })
                    .trim()
                    .transform(val => isString(val) && val.length > 0 ? DTO.text.transform(val) : undefined),
                { 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }
            )
    },
    [ParamType.NUMBER]: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .coerce
            .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'number', operator) }),
        ARRAY_VALUES: (name: string, operator?: string) => z
            .array(
                z
                    .coerce
                    .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }),
                { 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }
            )
    },
    NUMBER_MONETARY: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .coerce
            .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'number', operator) })
            .transform(MonetaryValue.toCents),
        ARRAY_VALUES: (name: string, operator?: string) => z
            .array(
                z
                    .coerce
                    .number({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) })
                    .transform(MonetaryValue.toCents),
                { 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'array number', operator) }
            )
    },
    [ParamType.BOOLEAN]: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .boolean({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'boolean', operator) })
    },
    [ParamType.STRING]: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .coerce
            .string({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'string', operator) })
            .trim()
            .transform(val => isString(val) && val.length > 0 ? DTO.text.transform(val) : undefined)
    },
    [ParamType.DATE]: {
        UNIQUE_VALUE: (name: string, operator?: string) => z
            .coerce
            .date({ 'invalid_type_error': GLOBAL_QUERY_SEARCH_DTO.messageInvalid(name, 'date', operator) }),
    },
}

export const QuerySearchDTO = {
    ENUM: {
        UNIQUE: (name: string) => QuerySearchHandlers[ParamType.ENUM].UNIQUE_VALUE(name),
        MANY_VALUES: (name: string) => QuerySearchHandlers[ParamType.ENUM].ARRAY_VALUES(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[ParamType.ENUM].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[ParamType.ENUM].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers[ParamType.ENUM].ARRAY_VALUES(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers[ParamType.ENUM].ARRAY_VALUES(name, ParamOperation.NOT_CONTAINS).optional(),
        }),
    },
    [ParamType.NUMBER]: {
        UNIQUE: (name: string) => QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name),
        MANY_VALUES: (name: string) => QuerySearchHandlers[ParamType.NUMBER].ARRAY_VALUES(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers[ParamType.NUMBER].ARRAY_VALUES(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers[ParamType.NUMBER].ARRAY_VALUES(name, ParamOperation.NOT_CONTAINS).optional(),
            [ParamOperation.GREATER_THAN]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN).optional(),
            [ParamOperation.GREATER_THAN_OR_EQUAL]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN_OR_EQUAL).optional(),
            [ParamOperation.LESS_THAN]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN).optional(),
            [ParamOperation.LESS_THAN_OR_EQUAL]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN_OR_EQUAL).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    NUMBER_MONETARY: {
        UNIQUE: (name: string) => QuerySearchHandlers.NUMBER_MONETARY.UNIQUE_VALUE(name),
        MANY_VALUES: (name: string) => QuerySearchHandlers.NUMBER_MONETARY.ARRAY_VALUES(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers.NUMBER_MONETARY.UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers.NUMBER_MONETARY.UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers.NUMBER_MONETARY.ARRAY_VALUES(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers.NUMBER_MONETARY.ARRAY_VALUES(name, ParamOperation.NOT_CONTAINS).optional(),
            [ParamOperation.GREATER_THAN]: QuerySearchHandlers.NUMBER_MONETARY.UNIQUE_VALUE(name, ParamOperation.GREATER_THAN).optional(),
            [ParamOperation.GREATER_THAN_OR_EQUAL]: QuerySearchHandlers.NUMBER_MONETARY.UNIQUE_VALUE(name, ParamOperation.GREATER_THAN_OR_EQUAL).optional(),
            [ParamOperation.LESS_THAN]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN).optional(),
            [ParamOperation.LESS_THAN_OR_EQUAL]: QuerySearchHandlers[ParamType.NUMBER].UNIQUE_VALUE(name, ParamOperation.LESS_THAN_OR_EQUAL).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    [ParamType.BOOLEAN]: {
        UNIQUE: (name: string) => QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    [ParamType.STRING]: {
        UNIQUE: (name: string) => QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.CONTAINS]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.CONTAINS).optional(),
            [ParamOperation.NOT_CONTAINS]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.NOT_CONTAINS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.STARS_WITH]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.STARS_WITH).optional(),
            [ParamOperation.ENDS_WITH]: QuerySearchHandlers[ParamType.STRING].UNIQUE_VALUE(name, ParamOperation.ENDS_WITH).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
    [ParamType.DATE]: {
        UNIQUE: (name: string) => QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name),
        SCHEMA: (name: string) => ({
            [ParamOperation.EQUALS]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.EQUALS).optional(),
            [ParamOperation.DIFFERENT]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.DIFFERENT).optional(),
            [ParamOperation.GREATER_THAN]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN).optional(),
            [ParamOperation.GREATER_THAN_OR_EQUAL]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.GREATER_THAN_OR_EQUAL).optional(),
            [ParamOperation.LESS_THAN]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.LESS_THAN).optional(),
            [ParamOperation.LESS_THAN_OR_EQUAL]: QuerySearchHandlers[ParamType.DATE].UNIQUE_VALUE(name, ParamOperation.LESS_THAN_OR_EQUAL).optional(),
            // [ParamOperation.FILLED]: QuerySearchHandlers[ParamType.BOOLEAN].UNIQUE_VALUE(name, ParamOperation.FILLED).optional(),
        }),
    },
}