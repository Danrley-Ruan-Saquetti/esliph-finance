import { Module } from '@esliph/module'
import { AppModule } from '@app/app.module'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { ValidatorService } from '@services/validator.service'
import { DatabaseService } from '@services/database.service'
import { MailService } from '@services/mail.service'
import { CodeGeneratorService } from '@services/code-generator.service'
import { WriteStreamOutput } from '@services/write-stream-output.service'
import { HttpService } from '@services/http.service'
import { MaskDataService } from '@services/mask-data.service'
import { QueryBuilderService } from '@services/query-builder.service'

@Module({
    imports: [AppModule],
    providers: [
        CryptoService,
        JWTService,
        DatabaseService,
        ValidatorService,
        MailService,
        CodeGeneratorService,
        WriteStreamOutput,
        HttpService,
        MaskDataService,
        QueryBuilderService,
        { whenCall: 'query-builder', use: 'global.service.query-builder' },
        { whenCall: 'mask-data', use: 'global.service.mask-data' },
        { whenCall: 'http', use: 'global.service.http' },
        { whenCall: 'write-stream-output', use: 'global.service.write-stream-output' },
        { whenCall: 'code-generator', use: 'global.service.code-generator' },
        { whenCall: 'crypto', use: 'global.service.crypto' },
        { whenCall: 'jwt', use: 'global.service.jwt' },
        { whenCall: 'validator', use: 'global.service.validator' },
        { whenCall: 'database', use: 'global.service.database' },
        { whenCall: 'mail', use: 'global.service.mail' },
    ],
})
export class MainModule { }
