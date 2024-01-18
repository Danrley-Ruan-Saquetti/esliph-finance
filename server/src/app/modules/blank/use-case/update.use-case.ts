import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { BlankRepository } from '@modules/blank/blank.repository'
import { GLOBAL_BLANK_DTO } from '@modules/blank/blank.global'
import { BlankModel } from '@modules/blank/blank.model'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_BLANK_DTO.id
})

export type BlankUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'blank.use-case.update' })
export class BlankUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('blank.repository') private blankRepository: BlankRepository) {
        super()
    }

    async perform(args: BlankUpdateDTOArgs) {
        const { id } = this.validateDTO(args, schemaDTO)

        await this.verifyIsExistsBlank(id)
        await this.update({}, id)

        return Result.success({ message: 'Blank updated successfully' })
    }

    private async verifyIsExistsBlank(id: ID) {
        const blankResult = await this.blankRepository.findUnique({ where: { id } })

        if (blankResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...blankResult.getError(), title: 'Find Blank' })
    }

    private async update(data: BlankModel.UpdateArgs, id: ID) {
        const updateResult = await this.blankRepository.update({ data, where: { id } })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...updateResult.getError(), title: 'Update Blank' })
    }
}
