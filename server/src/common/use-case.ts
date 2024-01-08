import { z } from 'zod'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ValidatorService } from '@services/validator.service'
import { MaskDataOptions, MaskDataService } from '@services/mask-data.service'
import { DateService } from '@services/date.service'
import { Repository } from '@services/repository.service'

@Service()
export class UseCase {
    protected validator: ValidatorService
    protected maskDataService: MaskDataService
    protected dateService: DateService
    protected database: Repository

    constructor() {
        this.validator = Injection.resolve(ValidatorService)
        this.maskDataService = Injection.resolve(MaskDataService)
        this.dateService = Injection.resolve(DateService)
        this.database = Injection.resolve(Repository)
    }

    protected validateDTO<ZodSchema extends z.Schema>(args: z.input<ZodSchema>, schema: ZodSchema) {
        return this.validator.performParse(args, schema).getValue()
    }

    protected maskArray<TypeObject extends object>(objs: TypeObject[], ...masks: { mask: MaskDataOptions; prop: keyof TypeObject }[]) {
        return objs.map(obj => this.maskProp(obj, ...masks))
    }

    protected maskProp<TypeObject extends object>(obj: TypeObject, ...masks: { mask: MaskDataOptions; prop: keyof TypeObject }[]) {
        masks.map(({ mask, prop }) => {
            // @ts-expect-error
            obj[prop] = this.mask(obj[prop], mask)
        })

        return obj
    }

    protected mask(data: string, mask: MaskDataOptions) {
        return this.maskDataService.mask(data, mask)
    }
}
