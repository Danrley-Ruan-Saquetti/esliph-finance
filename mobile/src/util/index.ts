export type PartialDeep<T> = { [x in keyof T]?: T[x] extends object ? PartialDeep<T[x]> : T[x] }

export function deepClone<T = any>(obj: T, hash = new WeakMap()): T {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj) as T
    }

    if (isClass(obj)) {
        return obj
    }

    if (hash.has(obj as any)) {
        return hash.get(obj as any)
    }

    const isArray = Array.isArray(obj)
    const clone: T = (isArray ? [] : {}) as T

    hash.set(obj as any, clone)

    if (isArray) {
        obj.forEach((item, index) => {
            // @ts-expect-error
            clone[index] = deepClone(item, hash)
        })
    } else {
        Object.keys(obj).forEach(key => {
            // @ts-expect-error
            clone[key] = deepClone(obj[key], hash)
        })
    }

    return clone
}

export function deepMerge(target: any, ...sources: any[]) {
    for (const source of sources) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = Array.isArray(source[key]) ? [] : {}
                    }
                    if (source[key] instanceof Date) {
                        target[key] = new Date(source[key])
                    } else {
                        deepMerge(target[key], source[key])
                    }
                } else {
                    target[key] = source[key]
                }
            }
        }
    }
    return target
}

export function randomIdIntWithDate() {
    const VALUE_MAX = 9999
    const now = new Date()

    const idString = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${Math.floor(Math.random() * VALUE_MAX)}`.padStart(
        `${VALUE_MAX}`.length,
        '0'
    )}`

    return Number(idString)
}

function isArray(value) {
    return isObject(value) && value instanceof Array
}

function isDate(value) {
    return isObject(value) && value instanceof Date
}

function isObject(value) {
    return typeof value == 'object'
}

function isClass(value) {
    return Object.getPrototypeOf(value) !== Object.prototype
}

function isUndefined(value) {
    return typeof value == 'undefined'
}

function mergeObjects(target, source) {
    for(const keySource in source) {
        if (isUndefined(source[keySource])) {
            continue
        }

        if (isObject(source[keySource])) {
            if (isArray(source[keySource])) {
                target[keySource] = mergeArrays(target[keySource] ?? [], source[keySource])
                continue
            }

            target[keySource] = {}

            mergeObjects(target[keySource], source[keySource])
            continue
        }

        target[keySource] = source[keySource]
    }

    return target
}

function mergeArrays(target, source) {
    source.map(sourceValue => {
        if (isObject(sourceValue)) {
            return target.push(mergeObjects({}, sourceValue))
        }

        if (isArray(sourceValue)) {
            return target.push(mergeArrays([], sourceValue))
        }

        target.push(sourceValue)
    })

    return target
}

function newDeepMerge(target, ...sources) {
    sources.map(source => {
        if (isObject(target)) {
            if (isObject(source)) {
                target = mergeObjects(target, source)
                return
            }

            if (isArray(target)) {
                if (isArray(source)) {
                    target = mergeArrays(target, source)
                    return
                }

                target.push(source)
                return
            }
        }
    })

    return target
}

newDeepMerge({}, {a: ['B', {}]}, {a: ['A', {b: 0}], b: ''})
newDeepMerge([], [{a: ''}], [0, [{a: '', b: ''}]])