import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { NoteRepository } from '@modules/note/note.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'

const schemaDTO = SchemaValidator.object({
    financialTransactionId: GLOBAL_NOTE_DTO.financialTransaction.id,
    notes: SchemaValidator
        .array(
            SchemaValidator.object({
                description: SchemaValidator
                    .string()
                    .trim()
                    .max(GLOBAL_NOTE_DTO.description.maxCharacters, { message: GLOBAL_NOTE_DTO.description.messageRangeCharacters })
                    .optional(),
            }),
        )
        .optional()
        .default([]),
})

export type NoteCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'note.use-case.create-many' })
export class NoteCreateManyUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private noteRepository: NoteRepository) {
        super()
    }

    async perform(args: NoteCreateDTOArgs) {
        const { notes, financialTransactionId } = this.validateDTO(args, schemaDTO)

        await this.registerNotes({ notes: notes.filter(note => !!note.description) as any, financialTransactionId })

        return Result.success({ message: 'Note registered successfully' })
    }

    private async registerNotes({ notes, financialTransactionId }: { financialTransactionId: ID; notes: { description: string }[] }) {
        const registerNoteResult = await this.noteRepository.createMany({ data: notes.map(({ description }) => ({ description, financialTransactionId })) })

        if (registerNoteResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerNoteResult.getError(),
            title: 'Register Notes',
        })
    }
}
