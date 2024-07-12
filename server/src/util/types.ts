export type ClassConstructor<T = any> = new (...args: any[]) => T
export type GenericObject = { [x: string]: any }

export function someHasValue(...values: any[]) {
    return !!values.find(value => !isUndefined(value))
}

export function isInstance<T = any>(obj: any): obj is ClassConstructor<T> {
    return !isObjectLiteral(obj)
}

export function isObjectLiteral(obj: any): obj is Object {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object
}

export function isTruthy<T = any>(value?: T): value is NonNullable<T> {
    return !isFalsy(value)
}

export function isFalsy(value?: any) {
    if (isNull(value) || isUndefined(value)) {
        return true
    }

    if (isNumber(value)) {
        return value == 0
    }

    if (isBoolean(value)) {
        return !value
    }

    if (isString(value)) {
        return value.trim().length == 0
    }

    if (isArray(value)) {
        return value.length == 0
    }

    if (isObject(value)) {
        return Object.keys(value).length == 0
    }

    return !value
}

export function isArray<T = any>(value: any): value is T[] {
    return Array.isArray(value) || (isObject(value) && value instanceof Array)
}

export function isDate(value: any): value is Date {
    return value instanceof Date
}

export function isBoolean(value: any): value is boolean {
    return getNativeType(value) == 'boolean'
}

export function isFunction(value: any): value is (...args: any[]) => any | void {
    return getNativeType(value) == 'function'
}

const AsyncFunction = (async () => { }).constructor
export function isAsyncFunction(value: any): value is (...args: any[]) => Promise<any | void> {
    return value instanceof AsyncFunction
}

export function isNumber(value: any, coerce = false): value is number {
    if (coerce)
        return !isNaN(Number(value))

    return getNativeType(value) == 'number'
}

export function isObject(value: any): value is object {
    return getNativeType(value) == 'object'
}

export function isString(value: any): value is string {
    return getNativeType(value) == 'string'
}

export function isClass(value: any): value is ClassConstructor {
    return Object.getPrototypeOf(value) !== Object.prototype
}

export function isUndefined(value: any): value is undefined {
    return getNativeType(value) == 'undefined'
}

export function isNull(value: any): value is null {
    return value == null
}

export function getNativeType(value: any) {
    return typeof value
}