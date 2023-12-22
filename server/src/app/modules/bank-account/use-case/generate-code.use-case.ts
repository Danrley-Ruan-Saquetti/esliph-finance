import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { CodeGeneratorService } from '@services/code-generator.service'
import { UseCase } from '@common/use-case'
import { GenerateCode } from '@common/generate-code'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { Result } from '@esliph/common'

export type BankAccountGenerateCodeDTOArgs = { noValid?: boolean }

@Service({ name: 'bank-account.use-case.generate-code' })
export class BankAccountGenerateCodeUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private repository: BankAccountRepository,
        @Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService,
    ) {
        super()
    }

    async generate(args: BankAccountGenerateCodeDTOArgs = {}) {
        const generator = Injection.resolve(GenerateCode)

        const codeResult = await generator.perform('Bank Account', {
            limitAttempts: GLOBAL_BANK_ACCOUNT_DTO.code.attempts,
            template: GLOBAL_BANK_ACCOUNT_DTO.code.template,
            validCode: this.validCode,
            ...args,
        })

        if (!codeResult.isSuccess()) {
            throw new BadRequestException({ ...codeResult.getError() })
        }

        return codeResult
    }

    valid(code: string) {
        if (this.codeGenerator.validate(code, GLOBAL_BANK_ACCOUNT_DTO.code.template)) {
            return Result.success({ ok: true })
        }

        return Result.failure({ title: 'Valid Code Bank Account', message: 'Invalid bank account code' })
    }

    private async validCode(code: string) {
        const bankAccountResult = await this.repository.findByCode(code)

        if (bankAccountResult.isSuccess()) {
            return false
        }

        if (bankAccountResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...bankAccountResult.getError(),
                title: 'Generate Code Bank Account',
                message: `Unable to generate code Bank Account. Error: "${bankAccountResult.getError().message}". Please, try again later`,
            })
        }

        return true
    }
}
