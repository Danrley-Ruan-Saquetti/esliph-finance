import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { toCapitalise } from '@util'
import { CodeGeneratorService, GenerateCodeOptions } from '@services/code-generator.service'

export type GenerateCodeArgs = { noValid: boolean; limitAttempts: number; template: GenerateCodeOptions; validCode: (code: string) => Promise<boolean> }

@Service({ name: 'common.generate-code' })
export class GenerateCode {
    private contAttempts = 0
    private isCodeValid = false
    private name = ''
    private limitAttempts = 5
    private template: GenerateCodeOptions = { template: '', charactersToReplace: [], valuesAllowed: [] }
    private validCode = async (code: string) => false

    constructor(@Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService) { }

    async perform(name: string, args: Partial<GenerateCodeArgs> = {}) {
        this.name = name
        if (args.limitAttempts) {
            this.limitAttempts = args.limitAttempts
        }
        if (args.template) {
            this.template = args.template
        }
        if (args.validCode) {
            this.validCode = async (code: string) => {
                // @ts-expect-error
                const result = await args.validCode(code)

                return result
            }
        }

        if (args.noValid) {
            return Result.success({ code: this.generate() })
        }

        const codeResult = await this.generateCode()

        return codeResult
    }

    private async generateCode() {
        let code = ''

        do {
            this.contAttempts++

            code = this.generate()
            this.isCodeValid = await this.validCode(code)

            if (!this.isCodeValid && this.contAttempts < this.limitAttempts) {
                return Result.failure<{ code: string }>({
                    title: `Generate Code ${toCapitalise(this.name)}`,
                    message: `Made many attempts to generate the ${toCapitalise(this.name)} Code. Please, try again later`,
                })
            }
        } while (!this.isCodeValid)

        return Result.success({ code })
    }

    private generate() {
        return this.codeGenerator.generateCode(this.template)
    }
}
