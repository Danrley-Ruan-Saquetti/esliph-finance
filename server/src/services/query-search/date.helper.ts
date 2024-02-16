import { Result } from '@core'
import { Json, isArray, isDate, isObject, isUndefined } from '@util'
import { GeneralHandlerOperationFilled } from '@services/query-search/general.helper'
import { ParamPayload, ParamSchema, ParamOperation, ParamOperationType } from '@services/query-search/types'
import { BadRequestException } from '@common/exceptions'

export function DateHandlerHelper(value: ParamPayload, name: string, schema: ParamSchema) {
    if (schema.uniqueValue || !isObject(value) || !isArray(value)) {
        const result = DateHandlerOperationUniqueValue(value, name)

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        if (!isDate(result.getValue())) {
            throw new BadRequestException({ title: 'Param Invalid', message: `Invalid date to param "${name}"` })
        }

        return result.getValue()
    }

    const values: ParamPayload = {}

    for (const operationName in value as any) {
        if (!DateHandlerOperation[operationName] || isUndefined(value[operationName]) || (isDate(value[operationName]) && !value[operationName])) {
            continue
        }
        const result = DateHandlerOperation[operationName](value[operationName], name) as Result

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        values[operationName] = result.getValue()
    }

    return values
}

export const DateHandlerOperation: { [x in ParamOperationType]?: (value: any, name: string) => Result } = {
    [ParamOperation.EQUALS]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.EQUALS),
    [ParamOperation.DIFFERENT]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.GREATER_THAN]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.GREATER_THAN_OR_EQUAL]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.LESS_THAN]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.LESS_THAN_OR_EQUAL]: (value: any, name: string) => DateHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.FILLED]: GeneralHandlerOperationFilled
}

function DateHandlerOperationUniqueValue(value: any, name: string, operation = '') {
    const valueJsonResult = Json.parse<Date>(value)

    if (!valueJsonResult.isSuccess() || !isDate(valueJsonResult.getValue())) {
        return Result.failure<Date>({ title: 'Param Invalid', message: `Invalid date to param "${name}${operation ? `.${operation}` : ''}"` })
    }

    return valueJsonResult
}