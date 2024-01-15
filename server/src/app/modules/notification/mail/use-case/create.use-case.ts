import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { MailRepository } from '@modules/notification/mail/mail.repository'
import { GLOBAL_MAIL_DTO } from '@modules/notification/mail/mail.global'
import { GLOBAL_NOTIFICATION_DTO } from '@modules/notification/notification.global'
import { NotificationModel } from '@modules/notification/notification.model'
import { MailModel } from '@modules/notification/mail/mail.model'

const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_NOTIFICATION_DTO.bankAccount.id,
    content: ValidatorService.schema
        .string({ 'required_error': GLOBAL_NOTIFICATION_DTO.content.messageRequired }),
    subject: ValidatorService.schema
        .string({ 'required_error': GLOBAL_NOTIFICATION_DTO.subject.messageRequired }),
    recipient: ValidatorService.schema
        .string({ 'required_error': GLOBAL_MAIL_DTO.recipient.messageRequired }),
    sender: ValidatorService.schema
        .string({ 'required_error': GLOBAL_MAIL_DTO.sender.messageRequired }),
})

export type MailCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'mail.use-case.create' })
export class MailCreateUseCase extends UseCase {
    constructor(@Injection.Inject('mail.repository') private mailRepository: MailRepository) {
        super()
    }

    async perform(args: MailCreateDTOArgs) {
        const { bankAccountId, content, recipient, sender, subject } = this.validateDTO(args, schemaDTO)

        await this.registerMail({ bankAccountId, content, recipient, sender, subject })

        return Result.success({ message: 'Mail registered successfully' })
    }

    private async registerMail({ bankAccountId, content, recipient, sender, subject }: Omit<NotificationModel.CreateArgs, 'type'> & MailModel.CreateArgs) {
        const registerMailResult = await this.mailRepository.create({
            data: {
                recipient,
                sender,
                notification: {
                    create: {
                        bankAccount: {
                            connect: { id: bankAccountId }
                        },
                        subject,
                        content,
                        situation: NotificationModel.Situation.IN_QUEUE,
                        type: NotificationModel.Type.Mail,
                    }
                }
            }
        })

        if (registerMailResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerMailResult.getError(),
            title: 'Register Mail',
        })
    }
}
