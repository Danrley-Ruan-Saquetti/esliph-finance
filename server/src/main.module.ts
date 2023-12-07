import { Module } from '@esliph/module'
import { AppModule } from '@app/app.module'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { ValidatorService } from '@services/validator.service'
import { DatabaseService } from '@services/database.service'

@Module({
    imports: [AppModule],
    providers: [
        CryptoService,
        JWTService,
        DatabaseService,
        ValidatorService,
        { whenCall: 'crypto', use: 'global.service.crypto' },
        { whenCall: 'jwt', use: 'global.service.jwt' },
        { whenCall: 'validator', use: 'global.service.validator' },
        { whenCall: 'database', use: 'global.service.database' },
    ],
})
export class MainModule { }
