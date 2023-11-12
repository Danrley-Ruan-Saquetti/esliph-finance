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

function isClass(object: any) {
    return Object.getPrototypeOf(object) !== Object.prototype
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