import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { SchemaValidator, ValidatorService } from '@server/services/validator.service'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: 'O nome é obrigatório' })
        .default('')
        .transform(val => val.replace(/ {2}/g, ' ')),
    email: ValidatorService.schema.string().email({ message: 'E-mail inválido' }).trim().min(1, { message: 'O e-mail é obrigatório' }).default(''),
    password: ValidatorService.schema.string().trim().min(1, { message: 'A senha é obrigatória' }).default(''),
})

export type AccountCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'account.use-case.create' })
export class AccountCreateUseCase {
    constructor(@Injection.Inject('validator') private validator: ValidatorService) {}

    async perform(args: AccountCreateDTOArgs) {
        const { email, name, password } = this.validator.performParse(args, schemaDTO).getValue()

        return Result.success({ message: 'Hello World' })
    }
}
