import { Service } from '@esliph/module'

export type GenerateCodeOptions = {
    template: string
    charactersToReplace: string[]
    charactersToIgnore?: string[]
    valuesAllowed: string[]
}

@Service({ name: 'global.service.code-generator' })
export class CodeGeneratorService {
    generateCode({ template, charactersToReplace, charactersToIgnore = [], valuesAllowed }: GenerateCodeOptions) {
        return template
            .split('')
            .map(templateDigit => {
                if (!charactersToReplace.find(characterToReplace => templateDigit === characterToReplace)) {
                    return templateDigit
                }

                if (charactersToIgnore.find(digit => digit === templateDigit)) {
                    return templateDigit
                }

                const indexValueRandom = Math.floor(Math.random() * valuesAllowed.length)
                return valuesAllowed[indexValueRandom]
            })
            .join('')
    }

    validate(code: string, { template, charactersToReplace, charactersToIgnore = [], valuesAllowed }: GenerateCodeOptions) {
        if (code.length !== template.length) {
            return false
        }

        const templateDigits = template.split('')

        for (let i = 0; i < templateDigits.length; i++) {
            const templateDigit = templateDigits[i]
            const codeDigit = code[i]

            if (!this.vaideDigits(codeDigit, templateDigit, { charactersToReplace, valuesAllowed, charactersToIgnore })) {
                return false
            }
        }

        return true
    }

    private vaideDigits(codeDigit: string, templateDigit: string, options: Omit<GenerateCodeOptions, 'template'>) {
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
        { charactersToReplace, valuesAllowed, charactersToIgnore = [] }: Omit<GenerateCodeOptions, 'template'>,
    ) {
        if (charactersToReplace.find(digit => digit === templateDigit)) {
            if (!valuesAllowed.find(digit => digit === codeDigit)) {
                return false
            }
        } else {
            return false
        }

        if (charactersToIgnore.find(digit => digit === templateDigit)) {
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
