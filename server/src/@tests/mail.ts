import { Injection } from '@esliph/injection'
import { MailService } from '@services/mail.service'

const mailService = Injection.resolve(MailService)

mailService.send({
    from: 'onboarding@resend.dev',
    to: 'danrsaquetti@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
})