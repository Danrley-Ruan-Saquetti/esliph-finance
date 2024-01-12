import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { CodeGeneratorService, GenerateCodeOptions } from '@services/code-generator.service'

@Service({ name: 'global.service.formatter-itin-cnpj' })
export class FormatterItinCnpjService {
    static GLOBAL_MASKS = {
        itin: {
            template: 'XXX.XXX.XXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
        cnpj: {
            template: 'XX.XXX.XXX/XXXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
    }

    constructor(@Injection.Inject('code-generator') private codeGenerator: CodeGeneratorService) { }

    formatItin(itin: string) {
        return this.codeGenerator.formatCode({ ...FormatterItinCnpjService.GLOBAL_MASKS.itin, values: itin.split('') })
    }

    formatCnpj(cnpj: string) {
        return this.codeGenerator.formatCode({ ...FormatterItinCnpjService.GLOBAL_MASKS.cnpj, values: cnpj.split('') })
    }

    extractDigitsOfTheItin(itin: string) {
        return this.removeLetters(itin)
    }

    extractDigitsOfTheCnpj(cnpj: string) {
        return this.removeLetters(cnpj)
    }

    private removeLetters(text: string) {
        return text.replace(/[^\d]+/g, '')
    }

    validItin(itin: string) {
        return this.codeGenerator.validate(itin, FormatterItinCnpjService.GLOBAL_MASKS.itin)
    }

    validCnpj(cnpj: string) {
        return this.codeGenerator.validate(cnpj, FormatterItinCnpjService.GLOBAL_MASKS.cnpj)
    }
}
