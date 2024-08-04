import { ResultException } from '@exceptions/result'
import { NotFoundException } from '@exceptions/not-found'
import { StatusCode } from '@enums/http'
import { JobService } from '@services/job'
import { GenerateGlobalMessagesRepository } from '@common/repository'

export type JobFindQuery = { where?: { name?: string }, orderBy?: { name?: 'asc' | 'desc' }, skip?: number, take?: number }

export class JobRepository {
    constructor(private job = new JobService(),) { }
    private static MESSAGES = GenerateGlobalMessagesRepository('job')

    findFirst(args: JobFindQuery) {
        try {
            const job = this.job.getJobByName(args?.where?.name || '')

            if (!job) {
                throw new NotFoundException({
                    title: JobRepository.MESSAGES.find.title,
                    message: JobRepository.MESSAGES.find.notFound,
                })
            }

            return job
        } catch (err) {
            throw new NotFoundException({
                title: JobRepository.MESSAGES.find.title,
                message: JobRepository.MESSAGES.find.failed,
            })
        }
    }

    query(args: JobFindQuery, page: { pageIndex: number, limite: number }) {
        const totalResult = this.count({
            where: { ...args.where }
        })

        const jobsResult = this.findMany({
            ...args,
            skip: page.pageIndex * page.limite,
            take: page.limite
        })

        const result = {
            jobs: jobsResult || [],
            metadata: {
                currentPage: page.pageIndex + 1,
                itemsPerPage: page.limite,
                totalOfItens: totalResult,
                totalOfPages: Math.ceil(totalResult / page.limite),
            }
        }

        return result
    }

    findMany(args: JobFindQuery) {
        try {
            const jobs = [...this.job.getJobs()]

            const jobsFiltered = !args?.where?.name ? jobs : jobs.filter(({ name }) => name.toLowerCase().includes(args?.where?.name || ''))
            const jobsSorted = !args?.orderBy?.name ? jobsFiltered : jobsFiltered.sort(((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0))

            return jobsSorted.slice(args.skip, args.take)
        } catch (err) {
            throw new ResultException({
                title: JobRepository.MESSAGES.findMany.title,
                message: JobRepository.MESSAGES.findMany.failed,
            }, StatusCode.INTERNAL_SERVER_ERROR)
        }
    }

    count(args: JobFindQuery) {
        try {
            const jobs = this.job.getJobs()

            const jobsFiltered = !args?.where?.name ? jobs : jobs.filter(({ name }) => name.toLowerCase().includes(args?.where?.name || ''))

            return jobsFiltered.slice(args.skip, args.take).length
        } catch (err) {
            throw new ResultException({
                title: JobRepository.MESSAGES.count.title,
                message: JobRepository.MESSAGES.count.failed,
            }, StatusCode.INTERNAL_SERVER_ERROR)
        }
    }
}
