import { Result } from '@core'
import { Json, isArray, isNumber, isObject, isString, isUndefined } from '@util'
import { GeneralHandlerOperationFilled } from '@services/query-search/general.helper'
import { ParamPayload, ParamSchema, ParamOperation, ParamOperationType } from '@services/query-search/types'
import { BadRequestException } from '@common/exceptions'

export function NumberHandlerHelper(value: ParamPayload, name: string, schema: ParamSchema) {
    if (schema.uniqueValue || !isObject(value)) {
        const result = NumberHandlerOperationUniqueValue(value, name)

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        if (!isNumber(result.getValue())) {
            return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid number to param "${name}"` })
        }

        return result.getValue()
    }

    const values: ParamPayload = {}

    for (const operationName in value as any) {
        if (!NumberHandlerOperation[operationName] || isUndefined(value[operationName]) || (isString(value[operationName]) && !value[operationName])) {
            continue
        }
        const result = NumberHandlerOperation[operationName](value[operationName], name) as Result

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        values[operationName] = result.getValue()
    }

    return values
}

export const NumberHandlerOperation: { [x in ParamOperationType]?: (value: any, name: string) => Result } = {
    [ParamOperation.CONTAINS]: NumberHandlerOperationContain,
    [ParamOperation.NOT_CONTAINS]: NumberHandlerOperationContain,
    [ParamOperation.EQUALS]: NumberHandlerOperationEqual,
    [ParamOperation.FILLED]: GeneralHandlerOperationFilled,
    [ParamOperation.DIFFERENT]: NumberHandlerOperationEqual,
    [ParamOperation.GREATER_THAN]: NumberHandlerOperationEqual,
    [ParamOperation.GREATER_THAN_OR_EQUAL]: NumberHandlerOperationEqual,
    [ParamOperation.LESS_THAN]: NumberHandlerOperationEqual,
    [ParamOperation.LESS_THAN_OR_EQUAL]: NumberHandlerOperationEqual,
}

function NumberHandlerOperationUniqueValue(value: any, name: string) {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isNumber(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid number to param "${name}"` })
    }

    return valueJsonResult
}

function NumberHandlerOperationContain(value: any, name: string) {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isArray(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid array number to param "${name}"` })
    }

    return valueJsonResult
}

function NumberHandlerOperationEqual(value: any, name: string) {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isNumber(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid array number to param "${name}"` })
    }

    return valueJsonResult
}
