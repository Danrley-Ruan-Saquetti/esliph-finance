export enum QueryType {
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
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
}

export type QueryParamType = keyof typeof QueryType
export type ParamOperationType = 'eq' | 'in' | 'fil' | 'nin' | 'lt' | 'lte' | 'gt' | 'gte' | 'dif'

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