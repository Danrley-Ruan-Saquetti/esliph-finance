import { Injection } from '@esliph/injection'
import { CompileTemplateService } from '@services/compile-template.service'
import { getPath } from '@util'

const TEMPLATE_PATH = getPath(...__dirname.split(/[\\/]/g), 'template.txt')

export type BankAccountCreateTemplateArgs = {
    bankAccountName: string
    bankAccountCode: string
    peopleName: string
}

export function BankAccountCreateTemplate(args: BankAccountCreateTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH, args)
}
