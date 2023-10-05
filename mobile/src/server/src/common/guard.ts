import { HttpStatusCodes, Result } from '@esliph/util-node'
import { Request } from '@esliph/util-node/dist/lib/http/server/handler/request'
import { Response } from '@esliph/util-node/dist/lib/http/server/handler/response'

export class Guard {
    static async perform(req: Request, res: Response) {
        const response = await Guard.validate(req)

        Guard.response(response, res)
    }

    protected static async validate(req: Request): Promise<Result> {
        return Result.success({ title: `Guard ${Guard.name}`, message: 'Method not implemented' }, HttpStatusCodes.NOT_IMPLEMENTED)
    }

    private static response<T>(result: Result<T>, res: Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
