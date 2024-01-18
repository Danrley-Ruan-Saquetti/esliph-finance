import { Service } from '@core'

export type MaskDataOptions = {
    template: string
    charactersToReplace: string[]
    valueReplace: string
}

export type ReplaceDataOptions = {
    character: string
}

export type BetweenDataOptions = {
    indexStart: number
    indexEnd: number
    character: string
}

@Service({ name: 'global.service.mask-data' })
export class MaskDataService {

    mask(data: string, { charactersToReplace = [], template = '', valueReplace }: MaskDataOptions) {
        return template.split('').map((digitTemplate, i) => {
            if (charactersToReplace.find(digit => digit === digitTemplate)) {
                return valueReplace
            }

            return data[i]
        }).join('')
    }

    replace(data: string, { character }: ReplaceDataOptions) {
        return data.split('').map(() => character).join('')
    }

    between(data: string, { character, indexEnd, indexStart }: BetweenDataOptions) {
        for (let i = indexStart; i < data.length - indexEnd; i++) {
            data = data.substring(0, i) + character + data.substring(i + 1)
        }

        return data
    }
}