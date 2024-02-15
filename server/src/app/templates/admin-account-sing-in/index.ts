import { Injection } from '@core'
import { CompileTemplateService } from '@services/compile-template.service'
import { getPath } from '@util'

const TEMPLATE_PATH = getPath(...__dirname.split(/[\\/]/g), 'template.txt')

export type AdminSignInTemplateArgs = {
    name: string
    dateTime: string
}

export function AdminSignInTemplate(args: AdminSignInTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH, args)
}
