import { Service } from '@esliph/module'

export type CodeFragsOptions = {
    template?: string
    value?: string
    prefix?: string
    sufix?: string
}

export type GenerateCodeOptions = {
    frags: CodeFragsOptions[]
    valuesAllowed: string[]
}

@Service({ name: 'global.service.code-generator' })
export class CodeGeneratorService {
    generateCode(args: GenerateCodeOptions) {
        return args.frags
            .map(frag => {
                if (frag.value) {
                    return frag.value
                }
                if (!frag.template) {
                    return ''
                }

                const prefix = frag.prefix || ''
                const sufix = frag.sufix || ''

                let codeFrag = prefix.substring(0, frag.template.length)

                for (let i = codeFrag.length; i < frag.template.length - sufix.length; i++) {
                    const indexValueRandom = Math.floor(Math.random() * args.valuesAllowed.length)
                    codeFrag += args.valuesAllowed[indexValueRandom]
                }

                codeFrag += sufix.substring(sufix.length - (frag.template.length - prefix.length))

                return codeFrag
            })
            .join('')
    }
}

const generator = new CodeGeneratorService()

const template: GenerateCodeOptions = {
    frags: [{ template: 'XXX', prefix: '01' }, { value: '-' }, { template: 'XXXXX', prefix: '10', sufix: '01' }, { value: '-' }, { template: 'XX' }],
    valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}

console.log(generator.generateCode(template))
