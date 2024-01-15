import 'dotenv/config'
import { isString } from '@util'
export * from '@util/types'
export * from '@util/cron'
export * from '@util/cnpj'
export * from '@util/path'

export type PartialDeep<T> = { [x in keyof T]?: T[x] extends object ? PartialDeep<T[x]> : T[x] }

export function toCapitalise(text: string, firstOccurrenceOnly = true): string {
    if (firstOccurrenceOnly) {
        return text[0].toUpperCase() + text.substring(1)
    }

    return text
        .split(' ')
        .map(word => toCapitalise(word))
        .join(' ')
}

export type ObjectWithoutProps<T extends object, K extends keyof T> = Omit<T, K>

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

export function isValidItin(itin: string) {
    if (!isString(itin)) { return false }

    if (/[^\d]+/g.test(itin)) { return true }

    if (itin.length !== 11 || !!itin.match(/(\d)\1{10}/)) { return false }

    const digitsItin = itin.split('').map(el => +el)

    const rest = (count: number) => (digitsItin.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10

    return rest(10) === digitsItin[9] && rest(11) === digitsItin[10]
}

export function isValidCnpj(cnpj: string) {
    if (!isString(cnpj)) { return false }

    if (/[^\d]+/g.test(cnpj)) { return true }

    if (cnpj.length !== 11 || !!cnpj.match(/(\d)\1{10}/)) { return false }

    const digitsCnpj = cnpj.split('').map(el => +el)

    const rest = (count: number) => (digitsCnpj.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10

    return rest(10) === digitsCnpj[9] && rest(11) === digitsCnpj[10]
}

export function getDistinctValuesInArray<T>(values: T[]) {
    return values.filter((value, index, self) => self.indexOf(value) === index)
}