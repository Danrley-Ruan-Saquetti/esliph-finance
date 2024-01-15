import { Prisma } from '@prisma/client'
import { Service } from '@esliph/module'
import { Repository } from '@services/repository.service'

type NotificationGetPayloadTypes = boolean | null | undefined | { select?: Prisma.NotificationSelect | null }
type NotificationGetPayload<T extends boolean | null | undefined | { select?: Prisma.NotificationSelect | null }> = Prisma.NotificationGetPayload<T>
type NotificationPropSelect<ArgsSelect extends NotificationGetPayloadTypes> = NotificationGetPayload<ArgsSelect>
type NotificationFindResponse<ArgsSelect extends NotificationGetPayloadTypes> = NotificationPropSelect<ArgsSelect>

@Service({ name: 'notification.repository' })
export class NotificationRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Notification',
            success: 'Notification successfully registered',
            failed: 'Failed to register notification'
        },
        remove: {
            title: 'Remove Notification',
            success: 'Notification successfully removed',
            failed: 'Failed to remove notification'
        },
        update: {
            title: 'Update Notification',
            success: 'Notification successfully updated',
            failed: 'Failed to update notification data'
        },
        find: {
            title: 'Find Notification',
            notFound: 'Notification not found',
            failed: 'Unable to query notification'
        },
        findMany: {
            title: 'Find Categories',
            failed: 'Unable to query categories'
        }
    }

    async create(args: { data: Prisma.NotificationCreateInput }) {
        try {
            await this.database.instance.notification.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: NotificationRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.create.title, message: NotificationRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.NotificationWhereUniqueInput, data: Prisma.NotificationUpdateInput }) {
        try {
            await this.database.instance.notification.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: NotificationRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.update.title, message: NotificationRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.NotificationWhereUniqueInput }) {
        try {
            await this.database.instance.notification.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: NotificationRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.remove.title, message: NotificationRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.NotificationFindFirstArgs>(args: Args) {
        try {
            const notification = await this.database.instance.notification.findFirst(args) as NotificationFindResponse<Args>

            return this.handleResponse<NotificationFindResponse<Args>>(notification, {
                noAcceptNullable: true,
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NotificationFindResponse<Args>>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.NotificationFindUniqueArgs>(args: Args) {
        try {
            const notification = await this.database.instance.notification.findUnique(args) as NotificationFindResponse<Args>

            return this.handleResponse<NotificationFindResponse<Args>>(notification, {
                noAcceptNullable: true,
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NotificationFindResponse<Args>>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.NotificationFindManyArgs>(args: Args) {
        try {
            const notification = await this.database.instance.notification.findMany(args) as NotificationFindResponse<Args>[]

            return this.handleResponse<NotificationFindResponse<Args>[]>(notification, {
                noAcceptNullable: true,
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NotificationFindResponse<Args>[]>(err, {
                error: { title: NotificationRepository.GLOBAL_MESSAGE.find.title, message: NotificationRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
