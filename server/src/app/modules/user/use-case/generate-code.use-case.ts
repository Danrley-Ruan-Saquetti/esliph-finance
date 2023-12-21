import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserRepository } from '@modules/user/user.repository'
import { CodeGeneratorService } from '@services/code-generator.service'

export type UserGenerateCodeDTOArgs = { noValid?: boolean }

@Service({ name: 'user.use-case.generate-code' })
export class UserGenerateCodeUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private repository: UserRepository,
        @Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService,
    ) {
        super()
    }

    async perform(args: UserGenerateCodeDTOArgs = {}) {
        if (args.noValid) {
            return Result.success({ code: this.generate() })
        }

        const code = await this.generateCode()

        return Result.success({ code })
    }

    private async generateCode() {
        let code = ''
        let contAttempts = 0

        do {
            contAttempts++

            if (contAttempts < 5) {
                throw new BadRequestException({
                    title: 'Register User',
                    message: 'Unable to register user. Error: "Cannot choise code user". Please, try again later',
                })
            }

            code = this.generate()
        } while (await this.validCode(code))

        return code
    }

    private generate() {
        return this.codeGenerator.generateCode(GLOBAL_USER_DTO.code.template)
    }

    private async validCode(code: string) {
        const userResult = await this.repository.findByCode(code)

        if (userResult.isSuccess()) {
            return false
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...userResult.getError(),
                title: 'Register User',
                message: `Unable to register user. Error: "${userResult.getError().message}". Please, try again later`,
            })
        }

        return true
    }
}
