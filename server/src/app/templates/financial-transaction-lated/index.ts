import { Injection } from '@core'
import { CompileTemplateService } from '@services/compile-template.service'
import { getPath } from '@util'

const TEMPLATE_PATH_INCOME = getPath(...__dirname.split(/[\\/]/g), 'template-income.txt')
const TEMPLATE_PATH_EXPENSE = getPath(...__dirname.split(/[\\/]/g), 'template-expense.txt')

export type FinancialTransactionIncomeLatedTemplateArgs = {
    peopleName: string
    transactionName: string
}

export type FinancialTransactionExpenseLatedTemplateArgs = {
    peopleName: string
    transactionName: string
}

export function FinancialTransactionIncomeLatedTemplate(args: FinancialTransactionIncomeLatedTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH_INCOME, args)
}

export function FinancialTransactionExpenseLatedTemplate(args: FinancialTransactionExpenseLatedTemplateArgs) {
    const compiler = Injection.resolve(CompileTemplateService)

    return compiler.compileByTemplatePath(TEMPLATE_PATH_EXPENSE, args)
}