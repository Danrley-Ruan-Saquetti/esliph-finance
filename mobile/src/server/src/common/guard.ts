import { HttpStatusCodes, Result } from '@esliph/util-node'
import { HttpEsliph } from '@esliph/util-node'

export class Guard {
    static async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const response = Result.failure({ title: 'Guard Request', message: 'Method not implemented' }, HttpStatusCodes.NOT_IMPLEMENTED)

        Guard.response(response, res)
    }

    protected static response<T>(result: Result<T>, res: HttpEsliph.Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
