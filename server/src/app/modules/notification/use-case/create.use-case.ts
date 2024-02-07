import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { NotificationRepository } from '@modules/notification/notification.repository'
import { NotificationModel } from '@modules/notification/notification.model'
import { GLOBAL_NOTIFICATION_DTO } from '@modules/notification/notification.global'

export const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_NOTIFICATION_DTO.bankAccount.id.optional(),
    content: ValidatorService.schema
        .string({ 'required_error': GLOBAL_NOTIFICATION_DTO.content.messageRequired }),
    subject: ValidatorService.schema
        .string({ 'required_error': GLOBAL_NOTIFICATION_DTO.subject.messageRequired }),
    type: ValidatorService.schema
        .enum(GLOBAL_NOTIFICATION_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_NOTIFICATION_DTO.type.messageEnumInvalid }) })
})

export type NotificationCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'notification.use-case.create' })
export class NotificationCreateUseCase extends UseCase {
    constructor(@Injection.Inject('notification.repository') private notificationRepository: NotificationRepository) {
        super()
    }

    async perform(args: NotificationCreateDTOArgs) {
        const { bankAccountId, content, subject, type } = this.validateDTO(args, schemaDTO)

        await this.registerNotification({ bankAccountId, content, subject, type })

        return Result.success({ message: 'Notification registered successfully' })
    }

    private async registerNotification({ bankAccountId, content, subject, type }: { bankAccountId?: ID, content: string, type: NotificationModel.Type, subject: string }) {
        const registerNotificationResult = await this.notificationRepository.create({
            data: {
                ...(bankAccountId && { bankAccount: { connect: { id: bankAccountId } } }),
                situation: NotificationModel.Situation.IN_QUEUE,
                content,
                type,
                subject,
            }
        })

        if (registerNotificationResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerNotificationResult.getError(),
            title: 'Register Notification',
        })
    }
}
