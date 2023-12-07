import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ValidatorService } from '@services/validator.service'
import { z } from 'zod'

@Service()
export class UseCase {
    protected validator: ValidatorService

    constructor() {
        this.validator = Injection.resolve(ValidatorService)
    }

    protected validateDTO<ZodSchema extends z.Schema>(args: z.input<ZodSchema>, schema: ZodSchema) {
        return this.validator.performParse(args, schema).getValue()
    }
}