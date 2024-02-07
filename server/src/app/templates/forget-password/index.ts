import { Injection } from '@core'
import { CompileTemplateService } from '@services/compile-template.service'
import { getPath } from '@util'

const TEMPLATE_PATH = getPath(...__dirname.split(/[\\/]/g), 'template.txt')

export type CustomerForgetPasswordTemplateArgs = {
    name: string
    email: string
    token: string
}

export function CustomerForgetPasswordTemplate(args: CustomerForgetPasswordTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH, args)
}
