import { Result } from '@core'
import { Json, isBoolean } from '@util'

export function GeneralHandlerOperationFilled(value: any, name: string) {
    const valueJsonResult = Json.parse<number | number[]>(value)

    if (!valueJsonResult.isSuccess() || !isBoolean(valueJsonResult.getValue())) {
        return Result.failure<number[]>({ title: 'Param Invalid', message: `Invalid boolean to param "${name}"` })
    }

    return valueJsonResult
}
