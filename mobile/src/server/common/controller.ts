import { HttpStatusCodes, Result, ResultException, HttpEsliph } from '@esliph/util-node'

export class Controller {
    initComponents() {
        throw new ResultException({ title: `Guard ${Controller.name}`, message: 'Method not implemented', status: HttpStatusCodes.NOT_IMPLEMENTED })
    }

    protected response<T>(result: Result<T>, res: HttpEsliph.Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
