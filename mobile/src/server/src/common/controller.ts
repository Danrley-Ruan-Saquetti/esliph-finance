import { HttpStatusCodes, Result } from '@esliph/util-node'
import { HttpEsliph } from '@esliph/util-node'

export class Controller {
    initComponents() {
        throw Result.failure({ title: `Guard ${Controller.name}`, message: 'Method not implemented' }, HttpStatusCodes.NOT_IMPLEMENTED)
    }

    protected response<T>(result: Result<T>, res: HttpEsliph.Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
