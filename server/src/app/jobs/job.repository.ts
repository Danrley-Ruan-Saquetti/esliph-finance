import { Injection, Service, Result } from '@core'
import { isNull } from '@util'
import { MetadataQuery } from '@@types'
import { JobService, JobModel } from '@services/job.service'

type JobFindQuery = { where?: { name?: string }, orderBy?: { name?: 'asc' | 'desc' }, skip?: number, take?: number }
type JobFindResponse = JobModel

@Service({ name: 'job.repository' })
export class JobRepository {
    constructor(
        @Injection.Inject('job') private job: JobService,
    ) { }

    private static GLOBAL_MESSAGE = {
        find: {
            title: 'Find Job',
            notFound: 'Job not found',
            failed: 'Unable to query job'
        },
        findMany: {
            title: 'Find Jobs',
            failed: 'Unable to query jobs'
        },
        count: {
            title: 'Count Jobs',
            failed: 'Unable to count jobs'
        }
    }

    findFirst(args: JobFindQuery) {
        const job = this.job.getJobByName(args?.where?.name || '')

        if (isNull(job)) {
            return Result.failure<JobFindResponse>({ title: JobRepository.GLOBAL_MESSAGE.find.title, message: JobRepository.GLOBAL_MESSAGE.find.notFound })
        }

        return Result.success<JobFindResponse>(job)
    }

    query(args: JobFindQuery, page: { pageIndex: number, limite: number }) {
        const totalResult = this.count({
            where: { ...args.where }
        })

        if (!totalResult.isSuccess()) {
            return Result.failure<{ jobs: JobFindResponse[], metadata: MetadataQuery }>({ title: JobRepository.GLOBAL_MESSAGE.findMany.title, message: JobRepository.GLOBAL_MESSAGE.findMany.failed })
        }

        const jobsResult = this.findMany({
            ...args,
            skip: page.pageIndex * page.limite,
            take: page.limite
        })

        if (!jobsResult.isSuccess()) {
            return Result.failure<{ jobs: JobFindResponse[], metadata: MetadataQuery }>({ title: JobRepository.GLOBAL_MESSAGE.findMany.title, message: JobRepository.GLOBAL_MESSAGE.findMany.failed })
        }

        const result = {
            jobs: jobsResult.getValue() || [],
            metadata: {
                currentPage: page.pageIndex + 1,
                itemsPerPage: page.limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / page.limite),
            }
        }

        return Result.success<{ jobs: JobFindResponse[], metadata: MetadataQuery }>(result)
    }

    findMany(args: JobFindQuery) {
        const jobs = this.job.getJobs().map(val => val)

        const jobsFiltered = !args?.where?.name ? jobs : jobs.filter(({ name }) => name.toLowerCase().includes(args?.where?.name || ''))
        const jobsSorted = !args?.orderBy?.name ? jobsFiltered : jobsFiltered.sort(((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0))

        return Result.success<JobFindResponse[]>(jobsSorted.slice(args.skip, args.take))
    }

    count(args: JobFindQuery) {
        const jobs = this.job.getJobs().filter(({ name }) => name.toLowerCase().includes(args?.where?.name || ''))

        const jobsFiltered = !args?.where?.name ? jobs : jobs.filter(({ name }) => name.toLowerCase().includes(args?.where?.name || ''))

        return Result.success(jobsFiltered.slice(args.skip, args.take).length)
    }
}
