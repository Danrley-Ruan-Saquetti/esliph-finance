import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/category.global'
import { CategoryModel } from '@modules/category/category.model'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_CATEGORY_DTO.id,
    name: ValidatorService.schema
        .string()
        .trim()
        .min(GLOBAL_CATEGORY_DTO.name.minCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .max(GLOBAL_CATEGORY_DTO.name.maxCharacters, { message: GLOBAL_CATEGORY_DTO.name.messageRangeCharacters })
        .optional()
        .transform(name => (!name ? undefined : GLOBAL_DTO.text.transform(name))),
    color: ValidatorService.schema
        .string()
        .trim()
        .max(GLOBAL_CATEGORY_DTO.color.maxCharacters, { message: GLOBAL_CATEGORY_DTO.color.messageRangeCharacters })
        .regex(GLOBAL_DTO.color.regex, { message: GLOBAL_DTO.color.messageRegex })
        .optional()
        .transform(color => (!color ? undefined : GLOBAL_DTO.color.transform(color))),
    isFavorite: ValidatorService.schema.boolean().optional(),
})

export type CategoryUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'category.use-case.update' })
export class CategoryUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('category.repository') private categoryRepository: CategoryRepository) {
        super()
    }

    async perform(args: CategoryUpdateDTOArgs) {
        const { id, color, name, isFavorite } = this.validateDTO(args, schemaDTO)

        if (!color && !name) {
            return Result.success({ message: 'Category updated successfully' })
        }

        await this.verifyIsExistsCategory(id)
        await this.update({ color, name, isFavorite }, id)

        return Result.success({ message: 'Category updated successfully' })
    }

    private async verifyIsExistsCategory(id: ID) {
        const categoryResult = await this.categoryRepository.findById(id)

        if (categoryResult.isSuccess()) {
            return
        }

        if (categoryResult.isErrorInOperation()) {
            throw new BadRequestException({ title: 'Find Category', message: `Unable to find category. Error "${categoryResult.getError()}"` })
        }

        throw new BadRequestException({ title: 'Find Category', message: 'Category not found' })
    }

    private async update({ color, isFavorite, name }: CategoryModel.UpdateArgs, id: ID) {
        const updateResult = await this.categoryRepository.updateById({ color, isFavorite, name }, { id })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ title: 'Update Category', message: `Unable to update category. Error "${updateResult.getError()}"` })
    }
}
