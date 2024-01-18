import { Result } from '@core'
import { Injection } from '@core'
import { Service } from '@core'
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
    login: ValidatorService.schema
        .string()
        .email({ message: GLOBAL_USER_DTO.login.messageInvalid })
        .max(GLOBAL_USER_DTO.login.maxCharacters, { message: GLOBAL_USER_DTO.login.messageRangeCharacters })
        .trim()
        .optional(),
    password: ValidatorService.schema
        .string()
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex })
        .optional(),
})

export type UserUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'user.use-case.update' })
export class UserUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('user.repository') private userRepository: UserRepository) {
        super()
    }

    async perform(args: UserUpdateDTOArgs) {
        const { id, login, password } = this.validateDTO(args, schemaDTO)

        if (!login && !password) {
            return Result.success({ message: 'No data updated' })
        }

        await this.verifyIsExistsUser(id)
        await this.update({ login, password }, id)

        return Result.success({ message: 'User updated successfully' })
    }

    private async verifyIsExistsUser(id: ID) {
        const userResult = await this.userRepository.findUnique({ where: { id } })

        if (userResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...userResult.getError(), title: 'Find User',
        })
    }

    private async update({ login, password }: UserModel.UpdateArgs, id: ID) {
        const updateResult = await this.userRepository.update({ where: { id }, data: { login, password } })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...updateResult.getError(), title: 'Update User',
        })
    }
}
