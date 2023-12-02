import { isString, isDate } from '@util'

export class Repository {
    protected modelName: string

    constructor(modelName: string) {
        this.modelName = modelName
    }

    protected prepareStatementNames(args: object) {
        return Object.keys(args).join(', ')
    }

    protected prepareStatementValues(args: object) {
        return Object.keys(args).map(key => {
            const value = args[key as keyof typeof args] as any

            if (isString(value) || isDate(value)) {
                return `'${value}'`
            }

            return value
        })
    }

    protected prepareStatementNamesToUpdate(args: object) {
        return Object.keys(args).map(key => `${key} = ?`).join(', ')
    }
}