import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { NoteRepository } from '@modules/note/note.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'
import { NoteModel } from '../note.model'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_NOTE_DTO.financialTransaction.id,
    description: ValidatorService.schema
        .string()
        .trim()
        .optional()
})

export type NoteUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'note.use-case.update' })
export class NoteUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private repository: NoteRepository) {
        super()
    }

    async perform(args: NoteUpdateDTOArgs) {
        const { id, description } = this.validateDTO(args, schemaDTO)

        if (!description) {
            return Result.success({ message: 'Note updated successfully' })
        }

        await this.verifyIsExistsNote(id)
        await this.update({ description, id })

        return Result.success({ message: 'Note updated successfully' })
    }

    private async verifyIsExistsNote(id: ID) {
        const noteResult = await this.repository.findById(id)

        if (noteResult.isSuccess()) {
            return
        }

        if (noteResult.isErrorInOperation()) {
            throw new BadRequestException({ title: 'Find Note', message: `Unable to find note. Error "${noteResult.getError()}"` })
        }

        throw new BadRequestException({ title: 'Find Note', message: 'Note not found' })
    }

    private async update({ id, description }: { id: ID, description: string }) {
        const updateResult = await this.repository.updateById({ description }, { id })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ title: 'Update Note', message: `Unable to update note. Error "${updateResult.getError()}"` })
    }
}
