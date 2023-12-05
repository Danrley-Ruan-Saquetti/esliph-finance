import { isAsyncFunction } from 'util/types'
import { Service } from '@esliph/module'
import { Decorator } from '@esliph/decorator'
import { Result, ErrorResultInfo } from '@esliph/common'
import { PrismaClient, Prisma } from '@resources/database/client'
import { DatabaseException, ServerInternalErrorException } from '@common/exceptions'
export * from '@resources/database/client'

@Service({ name: 'global.service.database' })
export class DatabaseService extends PrismaClient {}

export type RepositoryQueryOptions = {
    noThrow: boolean
    error: Partial<ErrorResultInfo>
}

export function RepositoryQuery(options: Partial<RepositoryQueryOptions> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        if (isAsyncFunction(originalMethod)) {
            descriptor.value = async (...args: any[]) => {
                try {
                    const result = await originalMethod(...args)

                    return validResultRespository(result, options)
                } catch (err: any) {
                    return validErrorRespository(err, options)
                }
            }
        } else {
            descriptor.value = (...args: any[]) => {
                try {
                    const result = originalMethod(...args)

                    return validResultRespository(result, options)
                } catch (err: any) {
                    return validErrorRespository(err, options)
                }
            }
        }
    }

    return Decorator.Create.Method(handler)
}

function validResultRespository(result: any, options: Partial<RepositoryQueryOptions> = {}) {
    if (!options.noThrow) {
        if (result instanceof Result && !result.isSuccess()) {
            throw new DatabaseException({ title: 'Database', message: 'Error on operation', ...options.error })
        }
    }

    return result
}

function validErrorRespository(error: any, options: Partial<RepositoryQueryOptions> = {}) {
    if (error instanceof Error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseException({ causes: [], title: 'Database', ...error, ...options.error })
        }

        throw new ServerInternalErrorException({ ...error })
    }

    return error
}
