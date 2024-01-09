import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { BlankModel } from '@modules/blank/blank.model'

@Service({ name: 'blank.repository' })
export class BlankRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Blank',
            success: 'Blank successfully registered',
            failed: 'Failed to register blank'
        },
        remove: {
            title: 'Remove Blank',
            success: 'Blank successfully removed',
            failed: 'Failed to remove blank'
        },
        update: {
            title: 'Update Blank',
            success: 'Blank successfully updated',
            failed: 'Failed to update blank data'
        },
        find: {
            title: 'Find Blank',
            notFound: 'Blank not found',
            failed: 'Unable to query blank'
        },
        findMany: {
            title: 'Find Blanks',
            failed: 'Unable to query blanks'
        }
    }

    async register(data: BlankModel.Model) {
        try {
            await this.database.instance['blank'].create({ data: data })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.create.title, message: BlankRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async updateById(args: BlankModel.UpdateArgs, where: { id: number }) {
        try {
            await this.database.instance['blank'].update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.update.title, message: BlankRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async removeById(where: { id: number }) {
        try {
            await this.database.instance['blank'].delete({ where: { id: where.id } })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.remove.title, message: BlankRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const blank = await this.database.instance['blank'].findFirst({ where: { id } })

            return this.handleResponse<BlankModel.Blank>(blank, {
                noAcceptNullable: true,
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BlankModel.Blank>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany() {
        try {
            const blanks = await this.database.instance['blank'].findMany({ where: {}, orderBy: {} })

            return this.handleResponse<BlankModel.Blank[]>(blanks)
        } catch (err: any) {
            return this.handleError<BlankModel.Blank[]>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.findMany.title, message: BlankRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
