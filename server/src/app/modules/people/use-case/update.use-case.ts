import { Result } from '@core'
import { Injection } from '@core'
import { Service } from '@core'
import { ID } from '@@types'
import { isUndefined } from '@util'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PeopleRepository } from '@modules/people/people.repository'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'
import { PeopleModel } from '@modules/people/people.model'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_PEOPLE_DTO.id,
    name: ValidatorService.schema
        .string()
        .trim()
        .transform(GLOBAL_DTO.text.transform)
        .refine(name => name.split(' ').length > 1, { message: GLOBAL_PEOPLE_DTO.name.messageLastNameRequired })
        .optional(),
    active: ValidatorService.schema
        .boolean()
        .optional(),
    dateOfBirth: ValidatorService.schema.coerce
        .date()
        .optional(),
    gender: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.gender.enum)
        .optional(),
})

export type PeopleUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'people.use-case.update' })
export class PeopleUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('people.repository') private peopleRepository: PeopleRepository) {
        super()
    }

    async perform(args: PeopleUpdateDTOArgs) {
        const { id, active, dateOfBirth, gender, name } = this.validateDTO(args, schemaDTO)

        if (isUndefined(active) && !dateOfBirth && !gender && !name) {
            return Result.success({ message: 'No data updated' })
        }

        await this.verifyIsExistsPeople(id)
        await this.update({ active, dateOfBirth, gender, name }, id)

        return Result.success({ message: 'People updated successfully' })
    }

    private async verifyIsExistsPeople(id: ID) {
        const peopleResult = await this.peopleRepository.findUnique({ where: { id } })

        if (peopleResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...peopleResult.getError(), title: 'Find People' })
    }

    private async update(data: PeopleModel.UpdateArgs, id: ID) {
        const updateResult = await this.peopleRepository.update({ where: { id }, data: { ...data } })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...updateResult.getError(), title: 'Update People' })
    }
}
