import { Request, Response } from '@@types/http'
import { FilterRouter } from '@server/components/filter'

export class MultiPartFieldsFilter implements FilterRouter {
    async perform(req: Request, res: Response) {

    }
}

export class MultiPartFilesFilter implements FilterRouter {
    async perform(req: Request, res: Response) {
        // const data = await req.file()
        // const stream = fs.createWriteStream(data?.filename || '')

        // stream.on('finish', () => {
        //     res.send({ ok: true })
        // })

        // stream.on('error', (error) => {
        //     res.send({ ok: false, error })
        // })

        // const buffer = await data?.toBuffer()

        // const content = buffer?.toString('utf-8')

        // stream.write(content)

        // stream.close()
    }
}

export class MultiPartFilesFieldsFilter implements FilterRouter {
    async perform(req: Request, res: Response) {

    }
}