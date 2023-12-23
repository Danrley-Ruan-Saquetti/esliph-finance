import { Service } from '@esliph/module'

export type MaskDataOptions = {
    template: string
    charactersToReplace: string[]
    valueReplace: string
}

@Service({ name: 'global.service.mask-data' })
export class MaskDataService {

    mask(data: string, { charactersToReplace = [], template = '', valueReplace }: MaskDataOptions) {
        return template.split('').map((digitTemplate, i) => {
            if (!charactersToReplace.find(digit => digit === digitTemplate)) {
                return valueReplace
            }

            return data[i]
        }).join('')
    }
}
