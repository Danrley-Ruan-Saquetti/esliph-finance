import { Service } from '@core'
import { Result } from '@core'
import { Resend } from 'resend'
import { GLOBAL_MAIL_CONFIG } from '@global'

export type MailOptions = {
    from: string
    to: string | string[]
    subject: string
    text?: string
    html?: string
}

@Service({ name: 'global.service.mail' })
export class MailService {
    private static transporter = new Resend(GLOBAL_MAIL_CONFIG.apiKey)

    async send(options: MailOptions) {
        try {
            const result = await this.transporter.emails.send(options as any)

            if (result.error) {
                return Result.failure({ ...result.error, title: 'Send Mail' })
            }

            return Result.success(result.data)
        } catch (err: any) {
            return Result.failure({ ...err, title: 'Send Mail' })
        }
    }

    private get transporter() {
        return MailService.transporter
    }
}