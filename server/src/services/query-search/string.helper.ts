import { Result } from '@core'
import { Json, isString, isObject, isUndefined, isArray } from '@util'
import { GeneralHandlerOperationFilled } from '@services/query-search/general.helper'
import { ParamPayload, ParamSchema, ParamOperation, ParamOperationType } from '@services/query-search/types'
import { BadRequestException } from '@common/exceptions'

export function StringHandlerHelper(value: ParamPayload, name: string, schema: ParamSchema) {
    if (schema.uniqueValue || !isObject(value) || !isArray(value)) {
        const result = StringHandlerOperationUniqueValue(value, name)

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        if (!isString(result.getValue())) {
            throw new BadRequestException({ title: 'Param Invalid', message: `Invalid string to param "${name}"` })
        }

        return result.getValue()
    }

    const values: ParamPayload = {}

    for (const operationName in value as any) {
        if (!StringHandlerOperation[operationName] || isUndefined(value[operationName]) || (isString(value[operationName]) && !value[operationName])) {
            continue
        }
        const result = StringHandlerOperation[operationName](value[operationName], name) as Result

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        values[operationName] = result.getValue()
    }

    return values
}

export const StringHandlerOperation: { [x in ParamOperationType]?: (value: any, name: string) => Result } = {
    [ParamOperation.EQUALS]: (value: any, name: string) => StringHandlerOperationUniqueValue(value, name, ParamOperation.EQUALS),
    [ParamOperation.CONTAINS]: (value: any, name: string) => StringHandlerOperationUniqueValue(value, name, ParamOperation.CONTAINS),
    [ParamOperation.DIFFERENT]: (value: any, name: string) => StringHandlerOperationUniqueValue(value, name, ParamOperation.DIFFERENT),
    [ParamOperation.FILLED]: GeneralHandlerOperationFilled,
    [ParamOperation.STARS_WITH]: (value: any, name: string) => StringHandlerOperationUniqueValue(value, name, ParamOperation.STARS_WITH),
    [ParamOperation.ENDS_WITH]: (value: any, name: string) => StringHandlerOperationUniqueValue(value, name, ParamOperation.ENDS_WITH),
}

function StringHandlerOperationUniqueValue(value: any, name: string, operation = '') {
    const valueJsonResult = Json.parse<string>(value)

    if (!valueJsonResult.isSuccess() || !isString(valueJsonResult.getValue())) {
        return Result.failure<string>({ title: 'Param Invalid', message: `Invalid string to param "${name}${operation ? `.${operation}` : ''}"` })
    }

    return valueJsonResult
}