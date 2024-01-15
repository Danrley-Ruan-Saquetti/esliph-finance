import { Module } from '@esliph/module'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { MailQueryUseCase } from '@modules/notification/mail/use-case/query.use-case'

@Module({
    providers: [MailCreateUseCase, MailQueryUseCase],
})
export class MailUseCaseModule { }
