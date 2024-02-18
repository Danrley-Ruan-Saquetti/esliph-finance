import { ClassConstructor } from '@@types'

export function isInstance<T extends ClassConstructor>(obj: any): obj is InstanceType<T> {
    return !isObjectLiteral(obj)
}

export function isObjectLiteral(obj: any): obj is Object {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object
}

export function isCodeHexadecimal(color: string) {
    if (isFalsy(color)) {
        return false
    }

    const colorCode = color.substring(0, 1) === '#' ? color.substring(1) : color

    switch (colorCode.length) {
        case 3: return /^[0-9A-F]{3}$/i.test(colorCode)
        case 6: return /^[0-9A-F]{6}$/i.test(colorCode)
        case 8: return /^[0-9A-F]{8}$/i.test(colorCode)
    }

    return false
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

export function isArray(value: any): value is any[] {
    return (isObject(value) && value instanceof Array) || Array.isArray(value)
}

export function isDate(value: any): value is Date {
    return isObject(value) && value instanceof Date
}

export function isBoolean(value: any): value is boolean {
    return getTypeNativeValue(value) == 'boolean'
}

export function isFunction(value: any): value is (...args: any[]) => any | void {
    return getTypeNativeValue(value) == 'function'
}

const AsyncFunction = (async () => { }).constructor
export function isAsyncFunction(value: any): value is (...args: any[]) => Promise<any | void> {
    return value instanceof AsyncFunction
}

export function isNumber(value: any, coerce = false): value is number {
    if (coerce) {
        return !isUndefined(value) && !isNaN(Number(value))
    }

    return getTypeNativeValue(value) == 'number'
}

export function isObject(value: any): value is object {
    return getTypeNativeValue(value) == 'object'
}

export function isString(value: any): value is string {
    return getTypeNativeValue(value) == 'string'
}

export function isClass(value: any): value is ClassConstructor {
    return Object.getPrototypeOf(value) !== Object.prototype
}

export function isUndefined(value: any): value is undefined {
    return getTypeNativeValue(value) == 'undefined'
}

export function isNull(value: any): value is null {
    return value == null
}

export function getTypeNativeValue(value: any) {
    return typeof value
}
