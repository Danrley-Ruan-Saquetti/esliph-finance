import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { MailRepository } from '@modules/notification/mail/mail.repository'
import { MailService } from '@services/mail.service'
import { NotificationModel } from '@modules/notification/notification.model'
import { MailModel } from '@modules/notification/mail/mail.model'

@Service({ name: 'mail.use-case.send-mail' })
export class MailSendMailUseCase extends UseCase {
    constructor(
        @Injection.Inject('mail.repository') private mailRepository: MailRepository,
        @Injection.Inject('mail') private mailService: MailService,
    ) {
        super()
    }

    async sendMailsInQueue() {
        const mails = await this.queryMailsInQueue()

        mails.map(async mail => {
            await this.sendMail(mail)
        })
    }

    private async queryMailsInQueue() {
        const mailsResult = await this.mailRepository.findMany({
            where: {
                notification: {
                    situation: NotificationModel.Situation.IN_QUEUE
                }
            },
            include: {
                notification: true
            },
            take: 10
        })

        if (!mailsResult.isSuccess()) {
            throw new BadRequestException({ ...mailsResult.getError(), title: 'Query Mails' })
        }

        return mailsResult.getValue()
    }

    private async sendMail(mail: MailModel.MailWithNotification) {
        const sendAt = this.dateService.now()
        const result = await this.mailService.send({
            from: mail.sender,
            to: mail.recipient,
            subject: mail.notification.subject,
            html: mail.notification.content
        })

        await this.updateSendMailSuccess({ sendAt, mailId: mail.id, isSuccess: result.isSuccess() })
    }

    private async updateSendMailSuccess({ mailId, sendAt, isSuccess }: { mailId: ID, sendAt: Date, isSuccess: boolean }) {
        await this.mailRepository.update({
            data: {
                notification: {
                    update: {
                        sendAt,
                        situation: isSuccess ? NotificationModel.Situation.SENT : NotificationModel.Situation.ERROR
                    }
                }
            },
            where: {
                id: mailId
            }
        })
    }
}
