import Nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { GLOBAL_LOG_CONFIG, GLOBAL_MAIL_CONFIG } from '@global'
import { WriteStreamOutput } from '@services/write-stream-output.service'

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
        host: GLOBAL_MAIL_CONFIG.host,
        port: GLOBAL_MAIL_CONFIG.port,
        secure: GLOBAL_MAIL_CONFIG.secure,
        service: GLOBAL_MAIL_CONFIG.service,
        auth: {
            user: GLOBAL_MAIL_CONFIG.mail,
            pass: GLOBAL_MAIL_CONFIG.pass
        }
    })

    static onLoad() {
        const writer = WriteStreamOutput.newInstance(`${GLOBAL_LOG_CONFIG.path}/mail.log`)

        this.transporter.on('error', err => {
            console.log(err.message)

            writer.write(JSON.stringify(err))
        })

        this.transporter.on('token', token => {
            console.log(token)

            writer.write(JSON.stringify(token))
        })
    }

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