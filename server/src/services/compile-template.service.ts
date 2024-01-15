import Handlebars from 'handlebars'
import { Service } from '@esliph/module'

@Service({ name: 'global.service.compile-template' })
export class CompileTemplateService {
    private static instance = Handlebars

    compile(template: any, args: { [x: string]: any } = {}) {
        const result = this.instance.compile(template)(args)

        return result
    }

    private get instance() {
        return CompileTemplateService.instance
    }
}