import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { BlankRepository } from '@modules/blank/blank.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'blank.use-case.query' })
export class BlankQueryUseCase extends UseCase {
    constructor(@Injection.Inject('blank.repository') private blankRepository: BlankRepository) {
        super()
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const blankResult = await this.blankRepository.findUnique({ where: { id } })

        if (!blankResult.isSuccess()) {
            return Result.failure({ ...blankResult.getError(), title: 'Query Blank' })
        }

        return Result.success(blankResult.getValue())
    }

    async queryMany() {
        const blanksResult = await this.blankRepository.findMany({})

        if (!blanksResult.isSuccess()) {
            return Result.failure({ ...blanksResult.getError(), title: 'Query Blanks' })
        }

        return Result.success(blanksResult.getValue() || [])
    }
}
