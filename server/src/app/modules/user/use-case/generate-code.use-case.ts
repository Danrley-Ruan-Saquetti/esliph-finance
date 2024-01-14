import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { CodeGeneratorService } from '@services/code-generator.service'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { GenerateCode } from '@common/generate-code'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserRepository } from '@modules/user/user.repository'

export type UserGenerateCodeDTOArgs = { noValid?: boolean }

@Service({ name: 'user.use-case.generate-code' })
export class UserGenerateCodeUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService,
    ) {
        super()
    }

    async perform(args: UserGenerateCodeDTOArgs = {}) {
        const generator = Injection.resolve(GenerateCode)

        const codeResult = await generator.perform('User', {
            limitAttempts: GLOBAL_USER_DTO.code.attempts,
            template: GLOBAL_USER_DTO.code.template,
            validCode: async (code: string) => {
                const userResult = await this.validCode(code)

                return userResult
            },
            ...args,
        })

        if (!codeResult.isSuccess()) {
            throw new BadRequestException({ ...codeResult.getError() })
        }

        return codeResult
    }

    valid(code: string) {
        if (this.codeGenerator.validate(code, GLOBAL_USER_DTO.code.template)) {
            return Result.success({ ok: true })
        }

        return Result.failure({ title: 'Valid Code Bank Account', message: 'Invalid bank account code' })
    }

    private async validCode(code: string) {
        const userResult = await this.userRepository.findUnique({ where: { code } })

        if (userResult.isSuccess()) {
            return false
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...userResult.getError(),
                title: 'Generate Code User',
            })
        }

        return true
    }
}
