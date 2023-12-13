import { Module } from '@esliph/module'
import { AppModule } from '@app/app.module'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { ValidatorService } from '@services/validator.service'
import { DatabaseService } from '@services/database.service'
import { MailService } from '@services/mail.service'

@Module({
    imports: [AppModule],
    providers: [
        CryptoService,
        JWTService,
        DatabaseService,
        ValidatorService,
        MailService,
        { whenCall: 'crypto', use: 'global.service.crypto' },
        { whenCall: 'jwt', use: 'global.service.jwt' },
        { whenCall: 'validator', use: 'global.service.validator' },
        { whenCall: 'database', use: 'global.service.database' },
        { whenCall: 'mail', use: 'global.service.mail' },
    ],
})
export class MainModule { }
