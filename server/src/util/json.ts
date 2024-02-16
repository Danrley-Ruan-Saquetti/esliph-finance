import { Result } from '@core'

export class Json {
    static parse<T>(text: string) {
        try {
            const result = JSON.parse(text)

            return Result.success<T>(result)
        } catch (err: any) {
            return Result.failure<T>({ title: 'JSON Parser', message: `Cannot parse of JSON. Error: "${err?.message || ''}"` })
        }
    }

    static toJSON(data: any, replacer?: (((this: any, key: string, value: any) => any) | undefined) | null, space?: string | number | undefined) {
        try {
            const result = JSON.stringify(data, replacer as any, space)

            return Result.success<string>(result)
        } catch (err: any) {
            return Result.failure<string>({ title: 'Converter to JSON', message: `Cannot converter to JSON. Error: "${err?.message || ''}"` })
        }
    }
}