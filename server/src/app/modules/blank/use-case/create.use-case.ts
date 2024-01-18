import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { BlankRepository } from '@modules/blank/blank.repository'
import { } from '@modules/blank/blank.global'

const schemaDTO = ValidatorService.schema.object({})

export type BlankCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'blank.use-case.create' })
export class BlankCreateUseCase extends UseCase {
    constructor(@Injection.Inject('blank.repository') private blankRepository: BlankRepository) {
        super()
    }

    async perform(args: BlankCreateDTOArgs) {
        const { } = this.validateDTO(args, schemaDTO)

        await this.registerBlank({})

        return Result.success({ message: 'Blank registered successfully' })
    }

    private async registerBlank(data: SchemaValidator.output<typeof schemaDTO>) {
        const registerBlankResult = await this.blankRepository.create({ data })

        if (registerBlankResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerBlankResult.getError(),
            title: 'Register Blank',
        })
    }
}
