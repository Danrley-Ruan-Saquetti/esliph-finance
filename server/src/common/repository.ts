import { ErrorResultInfo } from '@esliph/common'
import { Database } from '@services/database'
import { toCapitalise } from '@util/geral'

export type RepositoryHandleResponseOptions = { noAcceptNullable?: boolean, error: ErrorResultInfo }
export type RepositoryHandleErrorOptions = { error: ErrorResultInfo }

export class DatabaseRepository {
    protected database = new Database()

    async exec(query: TemplateStringsArray, ...values: any[]) {
        return await this.database.exec(query, ...values)
    }

    async execQuery<T = any>(query: TemplateStringsArray, ...values: any[]) {
        return await this.database.query<T>(query, ...values)
    }

    protected getResponse<T = any>(res: T | null) {
        return this.database.getResponse<T>(res)
    }

    protected getError<T = any>(err: any) {
        return this.database.getError<T>(err)
    }
}

export function GenerateGlobalMessagesRepository(name: string, pluralName = name + 's') {
    name = name.toLowerCase()
    pluralName = pluralName.toLowerCase()

    return {
        create: {
            title: `Register ${toCapitalise(name, false)}`,
            failed: `Unable to register ${name}. Try again later`
        },
        createMany: {
            title: `Register ${toCapitalise(pluralName, false)}`,
            failed: `Unable to register ${pluralName}. Try again later`
        },
        delete: {
            title: `Remove ${toCapitalise(name, false)}`,
            failed: `Unable to remove ${name}. Try again later`
        },
        deleteMany: {
            title: `Remove ${toCapitalise(pluralName, false)}`,
            failed: `Unable to remove ${pluralName.toLowerCase()}. Try again later`
        },
        update: {
            title: `Update ${toCapitalise(name, false)}`,
            failed: `Unable to update ${name}'s data. Try again later`
        },
        updateMany: {
            title: `Update ${toCapitalise(pluralName, false)}`,
            failed: `Unable to update ${pluralName.toLowerCase()} data. Try again later`
        },
        find: {
            title: `Find ${toCapitalise(name, false)}`,
            notFound: `${toCapitalise(name)} not found`,
            failed: `Unable to find ${name.toLowerCase()}. Try again later`
        },
        findMany: {
            title: `Find ${toCapitalise(pluralName, false)}`,
            failed: `Unable to find ${pluralName.toLowerCase()}. Try again later`
        },
        count: {
            title: `Count ${toCapitalise(pluralName, false)}`,
            failed: `Unable to count ${pluralName.toLowerCase()}. Try again later`
        }
    }
}