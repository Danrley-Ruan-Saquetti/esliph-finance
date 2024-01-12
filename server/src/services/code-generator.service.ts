import { Service } from '@esliph/module'
import { BadRequestException } from '../common/exceptions'

export type GenerateCodeOptions = {
    template: string
    charactersToReplace: string[]
    valuesAllowed: string[]
}

export type FormatCodeOptions = {
    template: string
    charactersToReplace: string[]
    values: string[]
}

@Service({ name: 'global.service.code-generator' })
export class CodeGeneratorService {
    generateCode({ template, charactersToReplace, valuesAllowed }: GenerateCodeOptions) {
        return template
            .split('')
            .map(templateDigit => {
                if (!this.isCharacterToReplace(templateDigit, charactersToReplace)) {
                    return templateDigit
                }

                const indexValueRandom = Math.floor(Math.random() * valuesAllowed.length)
                return valuesAllowed[indexValueRandom]
            })
            .join('')
    }

    validate(code: string, { template, charactersToReplace, valuesAllowed }: GenerateCodeOptions) {
        if (code.length !== template.length) {
            return false
        }

        const templateDigits = template.split('')

        for (let i = 0; i < templateDigits.length; i++) {
            const templateDigit = templateDigits[i]
            const codeDigit = code[i]

            if (!this.valideDigits(codeDigit, templateDigit, { charactersToReplace, valuesAllowed })) {
                return false
            }
        }

        return true
    }

    formatCode({ charactersToReplace, template, values }: FormatCodeOptions) {
        let index = -1
        return template.split('').map(templateDigit => {
            if (!this.isCharacterToReplace(templateDigit, charactersToReplace)) {
                return templateDigit
            }

            index++

            return values[index]
        }).join('')
    }

    private isCharacterToReplace(character: string, charactersToReplace: string[]) {
        return charactersToReplace.find(characterToReplace => character === characterToReplace)
    }

    private valideDigits(codeDigit: string, templateDigit: string, options: Omit<GenerateCodeOptions, 'template'>) {
        if (codeDigit !== templateDigit) {
            if (!this.wasSupposedBeDifferent(codeDigit, templateDigit, options)) {
                return false
            }
        } else {
            if (!this.wasSupposedBeEqual(templateDigit, options.charactersToReplace)) {
                return false
            }
        }

        return true
    }

    private wasSupposedBeDifferent(
        codeDigit: string,
        templateDigit: string,
        { charactersToReplace, valuesAllowed, }: Omit<GenerateCodeOptions, 'template'>,
    ) {
        if (charactersToReplace.find(digit => digit === templateDigit)) {
            if (!valuesAllowed.find(digit => digit === codeDigit)) {
                return false
            }
        } else {
            return false
        }

        return true
    }

    private wasSupposedBeEqual(templateDigit: string, charactersToReplace: string[]) {
        if (charactersToReplace.find(value => value === templateDigit)) {
            return false
        }

        return true
    }
}