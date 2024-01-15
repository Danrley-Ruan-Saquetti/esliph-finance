import { Injection } from '@esliph/injection'
import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'
import { MailSendMailUseCase } from '@modules/notification/mail/use-case/send-mail.use-case'

@Job({ name: 'job.mail' })
export class MailJob {
    constructor(@Injection.Inject('mail.use-case.send-mail') private sendMailUC: MailSendMailUseCase) { }

    @Cron({ name: 'send-mail', cronTime: CronExpression.EVERY_10_SECONDS, ignore: true })
    async sendMail() {
        await this.sendMailUC.sendMailsInQueue()
    }
}