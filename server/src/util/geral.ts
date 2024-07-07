import { GenericObject, isArray, isObject, isObjectLiteral, isUndefined, isDate, ClassConstructor } from '@util/types'

export function toCapitalise(text: string, firstOccurrenceOnly = true): string {
    if (firstOccurrenceOnly) {
        return text[0].toUpperCase() + text.substring(1)
    }

    return text
        .split(' ')
        .map(word => toCapitalise(word))
        .join(' ')
}

export function clearObject<T = any>(obj: T, isParent = true) {
    const newObj: T = {} as any

    if (!isObject(obj)) {
        if (isArray(obj))
            return (obj as any).length ? obj as T : undefined as T

        return obj as T
    }

    if (isArray(obj))
        return (obj as any).length ? obj as T : undefined as T

    if (isDate(obj)) {
        return obj as T
    }

    for (const propName in obj) {
        const value = obj[propName]

        const newValue = clearObject(value, false)

        if (!isUndefined(newValue))
            newObj[propName] = newValue
    }

    return (isParent ? newObj : Object.keys(newObj as any).length ? newObj : undefined) as T
}

export function createObjectByStringPath(path: string, parent: GenericObject = {}) {
    const routers = path.split('.')
    let currentObj: GenericObject = parent

    for (const router of routers) {
        if (isUndefined(currentObj[router])) {
            currentObj[router] = {}
        }
        currentObj = currentObj[router]
    }

    return { ...parent }
}

export function getObjectPathByIndex(obj: GenericObject, index: number) {
    let currentObj: GenericObject = { ...obj }

    for (let i = 0; i < index; i++) {
        currentObj = currentObj[Object.keys(currentObj)[0]]
    }

    return { ...currentObj }
}

export function getObjectPathByPath(obj: GenericObject, path: string) {
    let currentObj: GenericObject = obj

    const routers = path.split('.')

    for (let i = 0; i < routers.length; i++) {
        if (isUndefined(currentObj[routers[i]])) {
            continue
        }
        currentObj = currentObj[routers[i]]
    }

    return isArray(currentObj) ? [...currentObj as any] : isObjectLiteral(currentObj) ? { ...currentObj } : currentObj
}

export function insertValueInObjectByPath(obj: GenericObject, value: any, path: string) {
    let currentObj: GenericObject = obj

    const routers = path.split('.')

    for (let i = 0; i < routers.length; i++) {
        if (i < routers.length - 1) {
            currentObj = currentObj[routers[i]]
            continue
        }

        if (isArray(currentObj[routers[i]])) {
            currentObj[routers[i]].push(value)
        } else {
            currentObj[routers[i]] = value
        }
    }

    return { ...obj }
}

export function arrayToObject<T extends object = any>(arr: GenericObject[]) {
    return arr.reduce((fullObject, currentObject) => {
        for (const key in currentObject) {
            fullObject[key] = currentObject[key]
        }
        return fullObject
    }, {}) as T
}

export function getPropertiesMethodsFromClass(constructor: ClassConstructor) {
    const prototype = constructor.prototype
    return Object.getOwnPropertyNames(prototype).filter(name => typeof prototype[name] === 'function' && name !== 'constructor') as string[]
}

export function extractDigits(text: string) {
    return text.replace(/[^\d]+/g, '')
}

export function isEmptyValue(value: any) {
    if (isUndefined(value))
        return true

    if (isObject(value))
        for (const key in value)
            if (isUndefined(value[key]))
                return true

    if (isArray(value))
        return value.length == 0

    return false
}