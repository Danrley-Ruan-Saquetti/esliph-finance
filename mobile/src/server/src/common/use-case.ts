import { HttpStatusCodes, Result, ResultException } from '@esliph/util-node'
import { Service } from './service'

export class UseCase<ResultType, Params> extends Service {
    perform(args: Params): Result<ResultType> | Promise<Result<ResultType>> {
        throw new ResultException({ title: 'Use Case', message: 'Method not implemented', status: HttpStatusCodes.BAD_GATEWAY })
    }
}
