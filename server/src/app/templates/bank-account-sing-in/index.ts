import { Injection } from '@esliph/injection'
import { CompileTemplateService } from '@services/compile-template.service'
import { getPath } from '@util'

const TEMPLATE_PATH = getPath(...__dirname.split(/[\\/]/g), 'template.txt')

export type BankAccountSignInTemplateArgs = {
    bankAccountName: string
}

export function BankAccountSignInTemplate(args: BankAccountSignInTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH, args)
}
