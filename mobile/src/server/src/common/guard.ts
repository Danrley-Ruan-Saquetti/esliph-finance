import { HttpStatusCodes, Result } from '@esliph/util-node'
import { Request } from '@esliph/util-node/dist/lib/http/server/handler/request'
import { Response } from '@esliph/util-node/dist/lib/http/server/handler/response'

export class Guard {
    static async perform(req: Request, res: Response) {
        const response = Result.failure({ title: 'Guard Request', message: 'Method not implemented' }, HttpStatusCodes.NOT_IMPLEMENTED)

        Guard.response(response, res)
    }

    protected static response<T>(result: Result<T>, res: Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
