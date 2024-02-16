import { Result } from '@core'
import { Json, isArray, isNumber, isObject, isString, isUndefined } from '@util'
import { GeneralHandlerOperationFilled } from '@services/query-search/general.helper'
import { ParamPayload, ParamSchema, ParamOperation, ParamOperationType } from '@services/query-search/types'
import { BadRequestException } from '@common/exceptions'

export function NumberHandlerHelper(value: ParamPayload, name: string, schema: ParamSchema) {
    if (schema.uniqueValue || (!isObject(value) && !isArray(value))) {
        const result = NumberHandlerOperationUniqueValue(value, name)

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        if (!isNumber(result.getValue())) {
            throw new BadRequestException({ title: 'Param Invalid', message: `Invalid number to param "${name}"` })
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

    return values || undefined
}

export const NumberHandlerOperation: { [x in ParamOperationType]?: (value: any, name: string) => Result } = {
    [ParamOperation.CONTAINS]: (value: any, name: string) => NumberHandlerOperationContain(value, name, ParamOperation.CONTAINS),
    [ParamOperation.NOT_CONTAINS]: (value: any, name: string) => NumberHandlerOperationContain(value, name, ParamOperation.NOT_CONTAINS),
    [ParamOperation.EQUALS]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.EQUALS),
    [ParamOperation.FILLED]: GeneralHandlerOperationFilled,
    [ParamOperation.DIFFERENT]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.GREATER_THAN]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.GREATER_THAN),
    [ParamOperation.GREATER_THAN_OR_EQUAL]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.GREATER_THAN_OR_EQUAL),
    [ParamOperation.LESS_THAN]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.LESS_THAN),
    [ParamOperation.LESS_THAN_OR_EQUAL]: (value: any, name: string) => NumberHandlerOperationEqual(value, name, ParamOperation.LESS_THAN_OR_EQUAL),
}

function NumberHandlerOperationUniqueValue(value: any, name: string, operation = '') {
    console.log(value)
    const valueJsonResult = Json.parse<number | number[]>(value)

    console.log(valueJsonResult)

    if (!valueJsonResult.isSuccess() || !isNumber(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid number to param "${name}${operation ? `.${operation}` : ''}"` })
    }

    return valueJsonResult
}

function NumberHandlerOperationContain(value: any, name: string, operation = '') {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isArray(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid array number to param "${name}${operation ? `.${operation}` : ''}"` })
    }

    return valueJsonResult
}

function NumberHandlerOperationEqual(value: any, name: string, operation = '') {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isNumber(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid array number to param "${name}${operation ? `.${operation}` : ''}"` })
    }

    return valueJsonResult
}
