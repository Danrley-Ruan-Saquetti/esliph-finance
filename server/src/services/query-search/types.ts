export enum QueryType {
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    DATE = 'DATE',
}
export enum ParamOperation {
    EQUALS = 'eq',
    DIFFERENT = 'dif',
    CONTAINS = 'in',
    NOT_CONTAINS = 'nin',
    FILLED = 'fil',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUAL = 'lte',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUAL = 'gte',
    STARS_WITH = 'sw',
    ENDS_WITH = 'ew',
}

export type QueryParamType = keyof typeof QueryType
export type ParamOperationType = 'eq' | 'in' | 'fil' | 'nin' | 'lt' | 'lte' | 'gt' | 'gte' | 'dif' | 'ew' | 'sw'

export type ParamPayloadInput = string
export type ParamPayload = { [x in ParamOperationType]?: any } | boolean | number | string
export type QueryPayload = { [x: string]: ParamPayload }
export type ParamSchema = {
    type: QueryType,
    isOptional?: boolean,
    uniqueValue?: boolean
}
export type QuerySchema = { [x: string]: ParamSchema }

import { PrismaClient } from '@prisma/client'
new PrismaClient().contact.findFirst({
    where: {
        id: {

        }
    }
})
