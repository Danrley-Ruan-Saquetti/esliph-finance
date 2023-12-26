import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/category.global'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_CATEGORY_DTO.name.minCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .max(GLOBAL_CATEGORY_DTO.name.maxCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform),
    bankAccountId: GLOBAL_CATEGORY_DTO.bankAccount.id,
    color: ValidatorService.schema
        .string({ 'required_error': GLOBAL_CATEGORY_DTO.color.messageRequired })
        .trim()
        .max(GLOBAL_CATEGORY_DTO.color.maxCharacters, { message: GLOBAL_CATEGORY_DTO.color.messageRangeCharacters })
        .regex(GLOBAL_DTO.color.regex, { message: GLOBAL_DTO.color.messageRegex }),
    isFavorite: ValidatorService.schema.boolean().default(GLOBAL_CATEGORY_DTO.isFavorite.default),
})

export type CategoryCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'category.use-case.create' })
export class CategoryCreateUseCase extends UseCase {
    constructor(@Injection.Inject('category.repository') private repository: CategoryRepository) {
        super()
    }

    async perform(args: CategoryCreateDTOArgs) {
        const { bankAccountId, color, isFavorite, name } = this.validateDTO(args, schemaDTO)

        await this.registerCategory({ bankAccountId, color, isFavorite, name })

        return Result.success({ message: 'Category registered successfully' })
    }

    private async registerCategory({ bankAccountId, color, name, isFavorite }: SchemaValidator.output<typeof schemaDTO>) {
        const registerCategoryResult = await this.repository.register({ bankAccountId, color, name, isFavorite })

        if (registerCategoryResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerCategoryResult.getError(),
            title: 'Register Category',
            message: `Unable to register category. Error: "${registerCategoryResult.getError().message}"`,
        })
    }
}
