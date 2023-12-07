export * from '@prisma/client'
import { isAsyncFunction } from 'util/types'
import { PrismaClient, Prisma } from '@prisma/client'
import { Service } from '@esliph/module'
import { Decorator } from '@esliph/decorator'
import { Result, ErrorResultInfo } from '@esliph/common'
import { DatabaseException, ServerInternalErrorException } from '@common/exceptions'

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static instance = new PrismaClient()

    get instance() {
        return DatabaseService.instance
    }
}

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

                    return validResultRepository(result, options)
                } catch (err: any) {
                    return validErrorRepository(err, options)
                }
            }
        } else {
            descriptor.value = (...args: any[]) => {
                try {
                    const result = originalMethod(...args)

                    return validResultRepository(result, options)
                } catch (err: any) {
                    return validErrorRepository(err, options)
                }
            }
        }
    }

    return Decorator.Create.Method(handler)
}

function validResultRepository(result: any, options: Partial<RepositoryQueryOptions> = {}) {
    if (!options.noThrow) {
        if (result instanceof Result && !result.isSuccess()) {
            throw new DatabaseException({ title: 'Database', message: 'Error on operation', ...options.error })
        }
    }

    return result
}

function validErrorRepository(error: any, options: Partial<RepositoryQueryOptions> = {}) {
    if (error instanceof Error) {
        console.log(error)

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseException({ causes: [], title: 'Database', ...error, ...options.error })
        }

        throw new ServerInternalErrorException({ ...error })
    }

    return error
}
