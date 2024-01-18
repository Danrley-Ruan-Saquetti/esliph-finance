import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { NoteRepository } from '@modules/note/note.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_NOTE_DTO.financialTransaction.id,
    description: ValidatorService.schema.string().trim().optional(),
})

export type NoteUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'note.use-case.update' })
export class NoteUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private noteRepository: NoteRepository) {
        super()
    }

    async perform(args: NoteUpdateDTOArgs) {
        const { id, description } = this.validateDTO(args, schemaDTO)

        if (!description) {
            return Result.success({ message: 'No data updated' })
        }

        await this.verifyIsExistsNote(id)
        await this.update({ description, id })

        return Result.success({ message: 'Note updated successfully' })
    }

    private async verifyIsExistsNote(id: ID) {
        const noteResult = await this.noteRepository.findUnique({ where: { id } })

        if (noteResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...noteResult.getError(),
            title: 'Find Note',
        })
    }

    private async update({ id, description }: { id: ID; description: string }) {
        const updateResult = await this.noteRepository.update({ where: { id }, data: { description } })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...updateResult.getError(),
            title: 'Update Note',
        })
    }
}
