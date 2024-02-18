import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { NoteRepository } from '@modules/note/note.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'

const schemaDTO = SchemaValidator.object({
    id: GLOBAL_NOTE_DTO.financialTransaction.id,
})

export type NoteRemoveDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'note.use-case.remove' })
export class NoteRemoveUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private noteRepository: NoteRepository) {
        super()
    }

    async perform(args: NoteRemoveDTOArgs) {
        const { id } = this.validateDTO(args, schemaDTO)

        await this.removeNote(id)

        return Result.success({ message: 'Note removed successfully' })
    }

    private async removeNote(id: ID) {
        const removeResult = await this.noteRepository.delete({ where: { id } })

        if (removeResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ ...removeResult.getError(), title: 'Remove Note' })
    }
}
