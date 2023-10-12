import { HttpStatusCodes, Result, HttpEsliph } from '@esliph/util-node'
import { Inversion } from '../core/injection'
import { Service } from './service'

@Inversion.Injectable()
export class Guard extends Service {
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
