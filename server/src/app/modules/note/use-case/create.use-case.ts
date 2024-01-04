import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { NoteRepository } from '@modules/note/note.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'

const schemaDTO = ValidatorService.schema.object({
    financialTransactionId: GLOBAL_NOTE_DTO.financialTransaction.id,
    notes: ValidatorService.schema.array(
        ValidatorService.schema.object({
            description: ValidatorService
                .schema
                .string()
                .trim()
                .max(GLOBAL_NOTE_DTO.description.maxCharacters, { message: GLOBAL_NOTE_DTO.description.messageRangeCharacters })
                .optional()
        })
    ).optional().default([])
})

export type NoteCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'note.use-case.create-many' })
export class NoteCreateManyUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private repository: NoteRepository) {
        super()
    }

    async perform(args: NoteCreateDTOArgs) {
        const { notes, financialTransactionId } = this.validateDTO(args, schemaDTO)

        await this.registerNotes({ notes: notes.filter(note => !!note.description) as any, financialTransactionId })

        return Result.success({ message: 'Note registered successfully' })
    }

    private async registerNotes({ notes, financialTransactionId }: { financialTransactionId: ID, notes: { description: string }[] }) {
        const registerNoteResult = await this.repository.registerMany({ notes, financialTransactionId })

        if (registerNoteResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerNoteResult.getError(),
            title: 'Register Notes',
            message: `Unable to register notes. Error: "${registerNoteResult.getError().message}"`,
        })
    }
}
