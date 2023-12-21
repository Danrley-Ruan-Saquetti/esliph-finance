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
}
