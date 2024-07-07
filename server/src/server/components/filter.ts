import { Request, Response } from '@@types/http'

export abstract class FilterRouter {
    abstract perform(req: Request, res: Response): Promise<any | void>
}