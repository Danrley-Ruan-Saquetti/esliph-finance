import { Result } from '@core'
import { Json, isBoolean, isObject, isUndefined } from '@util'
import { GeneralHandlerOperationFilled } from '@services/query-search/general.helper'
import { ParamPayload, ParamSchema, ParamOperation, ParamOperationType } from '@services/query-search/types'
import { BadRequestException } from '@common/exceptions'

export function BooleanHandlerHelper(value: ParamPayload, name: string, schema: ParamSchema) {
    if (schema.uniqueValue || !isObject(value)) {
        const result = BooleanHandlerOperationUniqueValue(value, name)

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        if (!isBoolean(result.getValue())) {
            return Result.failure<boolean[]>({ title: 'Param Invalid', message: `Invalid boolean to param "${name}"` })
        }

        return result.getValue()
    }

    const values: ParamPayload = {}

    for (const operationName in value as any) {
        if (!BooleanHandlerOperation[operationName] || isUndefined(value[operationName])) {
            continue
        }
        const result = BooleanHandlerOperation[operationName](value[operationName], name) as Result

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }

        values[operationName] = result.getValue()
    }

    return values
}

export const BooleanHandlerOperation: { [x in ParamOperationType]?: (value: any, name: string) => Result } = {
    [ParamOperation.EQUALS]: BooleanHandlerOperationUniqueValue,
    [ParamOperation.DIFFERENT]: BooleanHandlerOperationUniqueValue,
    [ParamOperation.FILLED]: GeneralHandlerOperationFilled,
}

function BooleanHandlerOperationUniqueValue(value: any, name: string) {
    const valueJsonResult = Json.parse<boolean>(value)

    if (!valueJsonResult.isSuccess() || !isBoolean(valueJsonResult.getValue())) {
        return Result.failure<boolean>({ title: 'Param Invalid', message: `Invalid boolean to param "${name}"` })
    }

    return valueJsonResult
}