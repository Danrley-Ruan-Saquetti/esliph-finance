import { Module } from '@core'
import { MailController } from '@modules/notification/mail/mail.controller'
import { MailRepository } from '@modules/notification/mail/mail.repository'
import { MailUseCaseModule } from '@modules/notification/mail/use-case/use-case.module'

@Module({
    imports: [MailUseCaseModule],
    controllers: [MailController],
    providers: [MailRepository],
})
export class MailModule { }
