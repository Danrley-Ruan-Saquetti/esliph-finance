import path from 'node:path'
import fs from 'node:fs'
import marked, { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import fastifyStatic from '@fastify/static'
import { Result, Service } from '@core'
import { HttpService } from '@services/http.service'

@Service({ name: 'docs-api.service' })
export class DocsApiService {
    static BASE_PATH_CONTENT = path.join(process.cwd(), 'docs', 'content')
    static marked: Marked

    constructor() { }

    static onLoad() {
        DocsApiService.marked = new Marked(
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang, info) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
                    return hljs.highlight(code, { language }).value
                }
            })
        )
    }

    static onStart() {
        HttpService.instance.register(fastifyStatic, {
            root: path.join(process.cwd(), 'public', 'docs-api'),
            prefix: '/docs/api',
        })
    }

    async getContentByName(name: string) {
        if (!name) {
            return Result.failure({ title: 'Get Content Documentation', message: 'Name documentation not defined' })
        }

        const pathFile = path.join(DocsApiService.BASE_PATH_CONTENT, `${name}.md`)

        const content = fs.readFileSync(pathFile, 'utf-8')

        const contentInHTML = DocsApiService.marked.parse(content)

        return Result.success({ content: contentInHTML })
    }
}