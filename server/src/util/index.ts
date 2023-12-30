import 'dotenv/config'
export * from '@util/types'
export * from '@util/cron'

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
