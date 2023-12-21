import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { CodeGeneratorService } from '@services/code-generator.service'

export type BankAccountGenerateCodeDTOArgs = { noValid?: boolean }

@Service({ name: 'bank-account.use-case.generate-code' })
export class BankAccountGenerateCodeUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private repository: BankAccountRepository,
        @Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService,
    ) {
        super()
    }

    async perform(args: BankAccountGenerateCodeDTOArgs = {}) {
        if (args.noValid) {
            return Result.success({ code: this.generate() })
        }

        const code = await this.generateCode()

        return Result.success({ code })
    }

    private async generateCode() {
        let code = ''
        let contAttempts = 0
        let isCodeValid = false

        do {
            contAttempts++

            code = this.generate()
            isCodeValid = await this.validCode(code)

            if (!isCodeValid && contAttempts < GLOBAL_BANK_ACCOUNT_DTO.code.attempts) {
                throw new BadRequestException({
                    title: 'Generate Code Bank Account',
                    message: 'Made many attempts to generate the bank account code. Please, try again later',
                })
            }
        } while (!isCodeValid)

        return code
    }

    private generate() {
        return this.codeGenerator.generateCode(GLOBAL_BANK_ACCOUNT_DTO.code.template)
    }

    private async validCode(code: string) {
        const bankAccountResult = await this.repository.findByCode(code)

        if (bankAccountResult.isSuccess()) {
            return false
        }

        if (bankAccountResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...bankAccountResult.getError(),
                title: 'Generate Code BankAccount',
                message: `Unable to generate code bank-account. Error: "${bankAccountResult.getError().message}". Please, try again later`,
            })
        }

        return true
    }
}
