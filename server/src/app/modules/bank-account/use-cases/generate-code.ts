import { CodeGenerator } from '@services/code-generator'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { bankAccountRepository } = BankAccountModel

const codeGenerator = new CodeGenerator(
    GLOBAL_BANK_ACCOUNT_DTO.code.template.template,
    GLOBAL_BANK_ACCOUNT_DTO.code.template.charactersToReplace,
    GLOBAL_BANK_ACCOUNT_DTO.code.template.valuesAllowed,
)

export async function generateCode(attempts = 3) {
    const code = await codeGenerator.generateOrThrow(attempts, async (code) => {
        return !(await bankAccountRepository.isExists({ where: { code } }))
    }, { title: 'Generate code Bank Account', message: 'Unable to generate bank account code. Please try again later' })

    return { code }
}