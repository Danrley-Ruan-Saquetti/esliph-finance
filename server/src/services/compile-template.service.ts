import fs from 'node:fs'
import Handlebars from 'handlebars'
import { Service, Result } from '@core'

@Service({ name: 'global.service.compile-template' })
export class CompileTemplateService {
    private static instance = Handlebars

    compileByTemplatePath(path: string, args: { [x: string]: any } = {}) {
        try {
            const template = fs.readFileSync(path, { encoding: 'utf-8' })

            return this.compile(template, args)
        } catch (err: any) {
            return Result.failure({ title: 'Compile Template', message: `Template "${path}" file not found` })
        }
    }

    compile(template: any, args: { [x: string]: any } = {}) {
        try {
            const result = this.instance.compile(template)(args)

            return Result.success(result)
        } catch (err: any) {
            return Result.failure<string>({ ...err, title: 'Compile Template' })
        }
    }

    private get instance() {
        return CompileTemplateService.instance
    }
}