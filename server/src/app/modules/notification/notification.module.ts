import { Module } from '@esliph/module'
import { NotificationController } from '@modules/notification/notification.controller'
import { NotificationRepository } from '@modules/notification/notification.repository'
import { NotificationUseCaseModule } from '@modules/notification/use-case/use-case.module'
import { MailModule } from '@modules/notification/mail/mail.module'

@Module({
    imports: [NotificationUseCaseModule, MailModule],
    controllers: [NotificationController],
    providers: [NotificationRepository],
})
export class NotificationModule { }
