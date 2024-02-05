import path from 'path'
import fastifyStatic from '@fastify/static'
import { Service } from '@core'
import { HttpService } from '@services/http.service'

@Service({ name: 'docs-api.service' })
export class DocsApiService {
    constructor() { }

    static onStart() {
        HttpService.instance.register(fastifyStatic, {
            root: path.join(process.cwd(), 'public', 'docs-api'),
            prefix: '/docs/api',
        })
    }
}