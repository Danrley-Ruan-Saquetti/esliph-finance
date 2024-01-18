import { Module } from '@core'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { MailQueryUseCase } from '@modules/notification/mail/use-case/query.use-case'
import { MailSendMailUseCase } from '@modules/notification/mail/use-case/send-mail.use-case'

@Module({
    providers: [MailCreateUseCase, MailQueryUseCase, MailSendMailUseCase],
})
export class MailUseCaseModule { }
