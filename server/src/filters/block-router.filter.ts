import { Request, Response, Filter, FilterPerform } from '@core'
import { ForbiddenException } from '@common/exceptions'

@Filter({ name: 'global.filter.block-router' })
export class BlockRouterFilter implements FilterPerform {
    constructor() { }

    async perform(req: Request<any>, res: Response<any>) {
        throw new ForbiddenException({ message: 'Request forbidden' })
    }
}
