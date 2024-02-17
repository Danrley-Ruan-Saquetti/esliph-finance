import { Service } from '@core'
import { MetadataQuery } from '@@types'
import { Prisma } from '@services/database.service'
import { Repository } from '@services/repository.service'

type UserGetPayloadTypes = boolean | null | undefined | { select?: Prisma.UserSelect | null }
type UserGetPayload<T extends boolean | null | undefined | { select?: Prisma.UserSelect | null }> = Prisma.UserGetPayload<T>
type UserPropSelect<ArgsSelect extends UserGetPayloadTypes> = UserGetPayload<ArgsSelect>
type UserFindResponse<ArgsSelect extends UserGetPayloadTypes> = UserPropSelect<ArgsSelect>

@Service({ name: 'user.repository' })
export class UserRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register User',
            success: 'User successfully registered',
            failed: 'Failed to register user'
        },
        update: {
            title: 'Update User',
            success: 'User successfully updated',
            failed: 'Failed to update user data'
        },
        find: {
            title: 'Find User',
            notFound: 'User not found',
            failed: 'Unable to query user'
        },
        findMany: {
            title: 'Find Users',
            failed: 'Unable to query users'
        },
        count: {
            title: 'Count Users',
            failed: 'Unable to count users'
        }
    }

    async create(args: { data: Prisma.UserCreateInput }) {
        try {
            await this.database.instance.user.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: UserRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.create.title, message: UserRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput }) {
        try {
            await this.database.instance.user.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: UserRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.update.title, message: UserRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.UserFindFirstArgs>(args: Args) {
        try {
            const user = await this.database.instance.user.findFirst(args) as UserFindResponse<Args>

            return this.handleResponse<UserFindResponse<Args>>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserFindResponse<Args>>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.UserFindUniqueArgs>(args: Args) {
        try {
            const user = await this.database.instance.user.findUnique(args) as UserFindResponse<Args>

            return this.handleResponse<UserFindResponse<Args>>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserFindResponse<Args>>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async query<Args extends Prisma.UserFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
        const totalResult = await this.count({
            where: { ...args.where }
        })

        if (!totalResult.isSuccess()) {
            return this.handleError<{ users: UserFindResponse<Args>[], metadata: MetadataQuery }>(totalResult.getError(), {
                error: {
                    title: UserRepository.GLOBAL_MESSAGE.findMany.title,
                    message: UserRepository.GLOBAL_MESSAGE.findMany.failed
                }
            })
        }

        const usersResult = await this.findMany({
            ...args,
            skip: page.pageIndex * page.limite,
            take: page.limite
        })

        if (!usersResult.isSuccess()) {
            return this.handleError<{ users: UserFindResponse<Args>[], metadata: MetadataQuery }>(totalResult.getError(), {
                error: {
                    title: UserRepository.GLOBAL_MESSAGE.findMany.title,
                    message: UserRepository.GLOBAL_MESSAGE.findMany.failed
                }
            })
        }

        const result = {
            users: usersResult.getValue() || [],
            metadata: {
                currentPage: page.pageIndex,
                itemsPerPage: page.limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / page.limite),
            }
        }

        return this.handleResponse<{ users: UserFindResponse<Args>[], metadata: MetadataQuery }>(result as any)
    }

    async findMany<Args extends Prisma.UserFindManyArgs>(args: Args) {
        try {
            const user = await this.database.instance.user.findMany(args) as UserFindResponse<Args>[]

            return this.handleResponse<UserFindResponse<Args>[]>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserFindResponse<Args>[]>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async count(args: Prisma.UserCountArgs) {
        try {
            const user = await this.database.instance.user.count(args)

            return this.handleResponse<number>(user)
        } catch (err: any) {
            return this.handleError<number>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.count.title, message: UserRepository.GLOBAL_MESSAGE.count.failed }
            })
        }
    }
}
