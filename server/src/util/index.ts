import 'dotenv/config'

export type PartialDeep<T> = { [x in keyof T]?: T[x] extends object ? PartialDeep<T[x]> : T[x] }

export function toCapitalise(text: string, firstOccurrenceOnly = false) {
    if (!firstOccurrenceOnly) {
        return text[0].toUpperCase() + text.substring(1)
    }

    return text
        .split(' ')
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ')
}

export type ObjectWithoutProps<T extends object, K extends keyof T> = Omit<T, K>;

export function removeProps<T extends object, K extends keyof T>(obj: T, props: K[]): ObjectWithoutProps<T, K> {
    if (typeof obj !== 'object' || !Array.isArray(props)) {
        return obj as ObjectWithoutProps<T, K>
    }

    const newObj = { ...obj }

    props.forEach(propName => {
        if (newObj.hasOwnProperty(propName)) {
            delete newObj[propName]
        }
    })

    return newObj as ObjectWithoutProps<T, K>
}

export type ObjectExtractProps<T extends object, K extends keyof T> = Pick<T, K>;

export function extractProps<T extends object, K extends keyof T>(obj: T, props: K[]): ObjectExtractProps<T, K> {
    if (typeof obj !== 'object' || !Array.isArray(props)) {
        return obj as ObjectExtractProps<T, K>
    }

    const newObj = {} as any

    props.forEach(propName => {
        if (obj.hasOwnProperty(propName)) {
            newObj[propName] = obj[propName]
        }
    })

    return newObj as ObjectExtractProps<T, K>
}

export function isInstance(obj: any) {
    return !isObjectLiteral(obj)
}

export function isObjectLiteral(obj: any) {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object
}

export function isTruthy(value?: any) {
    return !isFalsy(value)
}

export function isFalsy(value?: any) {
    if (isNull(value)) {
        return true
    }

    if (isNumber(value)) {
        return value == 0
    }

    if (isBoolean(value)) {
        return !value
    }

    if (isString(value)) {
        return value.length == 0 || value.trim().length == 0
    }

    if (isArray(value)) {
        return value.length == 0
    }

    if (isObject(value)) {
        return Object.keys(value).length == 0
    }

    return isUndefined(value) || !value
}

export function isArray(value: any) {
    return (isObject(value) && value instanceof Array) || Array.isArray(value)
}

export function isDate(value: any) {
    return isObject(value) && value instanceof Date
}

export function isBoolean(value: any) {
    return getTypeNativeValue(value) == 'boolean'
}

export function isFunction(value: any) {
    return getTypeNativeValue(value) == 'function'
}

const AsyncFunction = (async () => { }).constructor
export function isAsyncFunction(value: any) {
    return value instanceof AsyncFunction
}

export function isNumber(value: any, coerce = false) {
    if (coerce) {
        return !isUndefined(value) && !isNaN(Number(value))
    }

    return getTypeNativeValue(value) == 'number'
}

export function isObject(value: any) {
    return getTypeNativeValue(value) == 'object'
}

export function isString(value: any) {
    return getTypeNativeValue(value) == 'string'
}

export function isClass(value: any) {
    return Object.getPrototypeOf(value) !== Object.prototype
}

export function isUndefined(value: any) {
    return getTypeNativeValue(value) == 'undefined'
}

export function isNull(value: any) {
    return value == null
}

export function getTypeNativeValue(value: any) {
    return typeof value
}

export type GetEnvArgs<DefaultType> = { name: string; defaultValue?: DefaultType; forceDefaultValue?: boolean; defaultValueInProduction?: boolean }

export function getEnv<DefaultType>({ name, defaultValue, forceDefaultValue, defaultValueInProduction }: GetEnvArgs<DefaultType>): DefaultType {
    const envValue = process.env[`${name}`] as DefaultType

    if (process.env['ENVIRONMENT'] == 'PRODUCTION') {
        if (!defaultValueInProduction) {
            return envValue as DefaultType
        }
    }

    if (!forceDefaultValue) {
        return (envValue || defaultValue) as DefaultType
    }

    return (defaultValue || envValue) as DefaultType
}
