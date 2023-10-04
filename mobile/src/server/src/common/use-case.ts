import { HttpStatusCodes, Result } from '@esliph/util-node'

export class UseCase<ResultType, Params> {
    perform(args: Params): Result<ResultType> | Promise<Result<ResultType>> {
        return Result.failure({ title: 'Use Case', message: 'Method not implemented' }, HttpStatusCodes.BAD_GATEWAY)
    }
}
