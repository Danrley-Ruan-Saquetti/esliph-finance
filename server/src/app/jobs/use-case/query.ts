import { DTO } from '@util/dto'
import { z, Validator } from '@services/validator'
import { QueryBuilder } from '@services/query-builder'
import { QuerySearchDTO } from '@services/query-builder/schema'
import { jobRepository } from '@repositories/job'

const queryBuilder = new QueryBuilder(
    [
        { field: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        { field: 'name', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'color', type: 'STRING', typeOperation: 'SCHEMA' },
        { field: 'isFavorite', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
        { field: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
    ],
    [
        { field: 'id' },
        { field: 'bankAccountId' },
        { field: 'name' },
        { field: 'color' },
        { field: 'type' },
        { field: 'isFavorite' },
        { field: 'createdAt' },
    ],
    [{ isFavorite: 'desc' }, { id: 'desc' }]
)

const schemaQuery = DTO.query.schema({ orders: ['name'] }).extend({
    name: QuerySearchDTO['STRING']['UNIQUE']('name').optional(),
})

export type SchemaQueryFiltersType = z.input<typeof schemaQuery>

export function query(args: SchemaQueryFiltersType) {
    const resultDTO = Validator.parseFilterNoSafe(args, schemaQuery)
    const { filters, orderBy } = queryBuilder.createQuery(resultDTO, resultDTO.orderBy)

    const result = jobRepository.query({
        where: { ...filters as any },
        orderBy: { ...orderBy as any }
    }, resultDTO)

    return {
        ...result, jobs: result.jobs.map(job => ({
            name: job.name,
            cronTime: job.cronTime.toString(),
            lastExecution: job.getLastExecution() as Date,
            nextExecution: job.getNextExecution(),
            isRunning: job.running,
        }))
    }
}

export function queryByName(args: SchemaQueryFiltersType) {
    const resultDTO = Validator.parseNoSafe(args, schemaQuery)

    const job = jobRepository.findFirst({ where: resultDTO })

    return {
        name: job.name,
        cronTime: job.cronTime.toString(),
        lastExecution: job.getLastExecution() as Date,
        nextExecution: job.getNextExecution(),
        isRunning: job.running,
    }
}