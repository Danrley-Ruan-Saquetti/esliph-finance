import Nodemailer from 'nodemailer'
import { Service } from '@esliph/module'
import { MAIL_CONFIG } from '@global'
import { Result } from '@esliph/common'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export type MailOptions = {
    from: string
    to: string | string[]
    subject: string
    text?: string
    html?: string
}

@Service({ name: 'global.service.mail' })
export class MailService {
    private static transporter = Nodemailer.createTransport({
        host: MAIL_CONFIG.host,
        port: MAIL_CONFIG.port,
        secure: MAIL_CONFIG.secure,
        service: MAIL_CONFIG.service,
        auth: {
            user: MAIL_CONFIG.mail,
            pass: MAIL_CONFIG.pass
        }
    })

    async send(options: MailOptions) {
        try {
            const response = await this.sendMail(options)
            return Result.success(response)
        } catch (err: any) {
            this.transporter.close()
            return Result.failure<SMTPTransport.SentMessageInfo>(err)
        }
    }

    private async sendMail(options: MailOptions) {
        return await this.transporter.sendMail(options)
    }

    private get transporter() {
        return MailService.transporter
    }
}