import { BadRequestException } from '@exceptions/bad-request'

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

export class CodeGenerator {
    constructor(
        private template: string,
        private charactersToReplace: string[],
        private valuesAllowed: string[]
    ) { }

    generateCode() {
        return CodeGenerator.generateCode({
            template: this.template,
            charactersToReplace: this.charactersToReplace,
            valuesAllowed: this.valuesAllowed,
        })
    }

    validate(code: string) {
        return CodeGenerator.validate(code, {
            template: this.template,
            charactersToReplace: this.charactersToReplace,
            valuesAllowed: this.valuesAllowed,
        })
    }

    formatCode(values: string[]) {
        return CodeGenerator.formatCode({
            values,
            template: this.template,
            charactersToReplace: this.charactersToReplace,
        })
    }

    async generateOrThrow(attempts = 3, validator: (code: string) => (Promise<boolean> | boolean) = () => true, error?: { title: string, message: string }) {
        const code = await this.generate(attempts, validator)

        if (!code)
            throw new BadRequestException({ title: 'Generate Code', message: 'Unable to generate code. Please try again later', ...error })

        return code
    }

    async generate(attempts = 3, validator: (code: string) => (Promise<boolean> | boolean) = () => true) {
        return CodeGenerator.generate(
            {
                template: this.template,
                charactersToReplace: this.charactersToReplace,
                valuesAllowed: this.valuesAllowed,
            },
            attempts,
            validator
        )
    }

    static async generate(options: GenerateCodeOptions, attempts = 3, validator: (code: string) => (Promise<boolean> | boolean) = () => true) {
        let code: string = ''

        do {
            code = CodeGenerator.generateCode(options)

            const result = await validator(code)

            if (result)
                return code

            attempts--
        } while (attempts > 0)

        return null
    }

    static generateCode({ template, charactersToReplace, valuesAllowed }: GenerateCodeOptions) {
        return template
            .split('')
            .map(templateDigit => {
                if (!this.isCharacterToReplace(templateDigit, charactersToReplace))
                    return templateDigit

                return valuesAllowed.length ? valuesAllowed[Math.floor(Math.random() * valuesAllowed.length)] : ''
            })
            .join('')
    }

    static validate(code: string, { template, charactersToReplace, valuesAllowed }: GenerateCodeOptions) {
        if (code.length !== template.length)
            return false

        const templateDigits = template.split('')

        for (let i = 0; i < templateDigits.length; i++)
            if (!this.valideDigits(code[i], templateDigits[i], { charactersToReplace, valuesAllowed }))
                return false

        return true
    }

    static formatCode({ template, charactersToReplace, values }: FormatCodeOptions) {
        let index = -1
        return template.split('').map(templateDigit => {
            if (!this.isCharacterToReplace(templateDigit, charactersToReplace)) return templateDigit

            return values[index++]
        }).join('')
    }

    private static isCharacterToReplace(character: string, charactersToReplace: string[]) {
        return charactersToReplace.find(characterToReplace => character === characterToReplace)
    }

    private static valideDigits(codeDigit: string, templateDigit: string, options: Omit<GenerateCodeOptions, 'template'>) {
        if (codeDigit !== templateDigit && !this.wasSupposedBeDifferent(codeDigit, templateDigit, options))
            return false

        return !this.wasSupposedBeEqual(templateDigit, options.charactersToReplace)
    }

    private static wasSupposedBeDifferent(
        codeDigit: string,
        templateDigit: string,
        { charactersToReplace, valuesAllowed }: Omit<GenerateCodeOptions, 'template'>,
    ) {
        if (!charactersToReplace.find(digit => digit === templateDigit))
            return false

        return !!valuesAllowed.find(digit => digit === codeDigit)
    }

    private static wasSupposedBeEqual(templateDigit: string, charactersToReplace: string[]) {
        return !charactersToReplace.find(value => value === templateDigit)
    }
}