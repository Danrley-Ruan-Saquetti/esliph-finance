import { Result } from '@esliph/util-node'
import { Response } from '@esliph/util-node/dist/lib/http/server/handler/response'

export class Controller {
    initComponents() {
        throw new Error('Method not implemented.')
    }

    protected response<T>(result: Result<T>, res: Response<T>) {
        res.status(result.getStatus())

        if (!result.isSuccess()) {
            return res.error(result.getError())
        }

        res.send(result.getValue())
    }
}
