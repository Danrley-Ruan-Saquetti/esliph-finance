import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { GLOBAL_DTO } from '@global'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserModel } from '@modules/user/user.model'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_USER_DTO.id,
    name: ValidatorService.schema
        .string()
        .trim()
        .min(GLOBAL_USER_DTO.name.minCharacters, { message: GLOBAL_USER_DTO.name.messageRangeCharacters })
        .max(GLOBAL_USER_DTO.name.maxCharacters, { message: GLOBAL_USER_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform)
        .optional(),
})

export type UserUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'user.use-case.update' })
export class UserUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('user.repository') private repository: UserRepository) {
        super()
    }

    async perform(args: UserUpdateDTOArgs) {
        const { id, name } = this.validateDTO(args, schemaDTO)

        if (!name) {
            return Result.success({ message: 'User updated successfully' })
        }

        await this.verifyIsExistsUser(id)
        await this.update({ name }, id)

        return Result.success({ message: 'User updated successfully' })
    }

    private async verifyIsExistsUser(id: ID) {
        const userResult = await this.repository.findById(id)

        if (userResult.isSuccess()) {
            return
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({ title: 'Find User', message: `Unable to find user. Error "${userResult.getError()}"` })
        }

        throw new BadRequestException({ title: 'Find User', message: 'User not found' })
    }

    private async update({ name }: UserModel.UpdateArgs, id: ID) {
        const updateResult = await this.repository.updateById({ name }, { id })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ title: 'Update User', message: `Unable to update user. Error "${updateResult.getError()}"` })
    }
}
