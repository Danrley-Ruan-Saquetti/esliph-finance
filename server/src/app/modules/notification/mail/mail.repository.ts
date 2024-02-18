import { Prisma } from '@services/database.service'
import { Service } from '@core'
import { Repository } from '@services/repository.service'

type MailGetPayloadTypes = boolean | null | undefined | { select?: Prisma.MailSelect | null }
type MailGetPayload<T extends boolean | null | undefined | { select?: Prisma.MailSelect | null }> = Prisma.MailGetPayload<T>
type MailPropSelect<ArgsSelect extends MailGetPayloadTypes> = MailGetPayload<ArgsSelect>
type MailFindResponse<ArgsSelect extends MailGetPayloadTypes> = MailPropSelect<ArgsSelect>

@Service({ name: 'mail.repository' })
export class MailRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Mail',
            success: 'Mail successfully registered',
            failed: 'Failed to register mail'
        },
        remove: {
            title: 'Remove Mail',
            success: 'Mail successfully removed',
            failed: 'Failed to remove mail'
        },
        update: {
            title: 'Update Mail',
            success: 'Mail successfully updated',
            failed: 'Failed to update mail data'
        },
        find: {
            title: 'Find Mail',
            notFound: 'Mail not found',
            failed: 'Unable to query mail'
        },
        findMany: {
            title: 'Find Mails',
            failed: 'Unable to query mails'
        }
    }

    async create(args: { data: Prisma.MailCreateInput }) {
        try {
            await this.database.instance.mail.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: MailRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.create.title, message: MailRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.MailWhereUniqueInput, data: Prisma.MailUpdateInput }) {
        try {
            await this.database.instance.mail.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: MailRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.update.title, message: MailRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.MailWhereUniqueInput }) {
        try {
            await this.database.instance.mail.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: MailRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.remove.title, message: MailRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.MailFindFirstArgs>(args: Args) {
        try {
            const mail = await this.database.instance.mail.findFirst(args) as MailFindResponse<Args>

            return this.handleResponse<MailFindResponse<Args>>(mail, {
                noAcceptNullable: true,
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<MailFindResponse<Args>>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.MailFindUniqueArgs>(args: Args) {
        try {
            const mail = await this.database.instance.mail.findUnique(args) as MailFindResponse<Args>

            return this.handleResponse<MailFindResponse<Args>>(mail, {
                noAcceptNullable: true,
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<MailFindResponse<Args>>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.MailFindManyArgs>(args: Args) {
        try {
            const mail = await this.database.instance.mail.findMany(args) as MailFindResponse<Args>[]

            return this.handleResponse<MailFindResponse<Args>[]>(mail, {
                noAcceptNullable: true,
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<MailFindResponse<Args>[]>(err, {
                error: { title: MailRepository.GLOBAL_MESSAGE.find.title, message: MailRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
