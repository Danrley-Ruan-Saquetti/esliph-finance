import { Module } from '@core'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { ValidatorService } from '@services/validator.service'
import { DatabaseService } from '@services/database.service'
import { MailService } from '@services/mail.service'
import { CodeGeneratorService } from '@services/code-generator.service'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
import { HttpService } from '@services/http.service'
import { MaskDataService } from '@services/mask-data.service'
import { QueryBuilderService } from '@services/query-builder.service'
import { JobService } from '@services/job.service'
import { DateService } from '@services/date.service'
import { FormatterItinCnpjService } from '@services/formatter-itin-cnpj.service'
import { ApiService } from '@services/api.service'

@Module({
    providers: [
        CryptoService,
        JWTService,
        DatabaseService,
        ValidatorService,
        MailService,
        CodeGeneratorService,
        WriteStreamOutputService,
        HttpService,
        MaskDataService,
        QueryBuilderService,
        JobService,
        DateService,
        FormatterItinCnpjService,
        ApiService,
        { whenCall: 'api', use: 'global.service.api' },
        { whenCall: 'formatter-itin-cnpj', use: 'global.service.formatter-itin-cnpj' },
        { whenCall: 'date', use: 'global.service.date' },
        { whenCall: 'job', use: 'global.service.job' },
        { whenCall: 'query-builder', use: 'global.service.query-builder' },
        { whenCall: 'mask-data', use: 'global.service.mask-data' },
        { whenCall: 'http', use: 'global.service.http' },
        { whenCall: 'write-stream-output', use: 'global.service.write-stream-output' },
        { whenCall: 'code-generator', use: 'global.service.code-generator' },
        { whenCall: 'crypto', use: 'global.service.crypto' },
        { whenCall: 'jwt', use: 'global.service.jwt' },
        { whenCall: 'validator', use: 'global.service.validator' },
        { whenCall: 'database', use: 'global.service.database' },
        { whenCall: 'repository', use: 'global.service.repository' },
        { whenCall: 'mail', use: 'global.service.mail' },
    ],
})
export class ServiceModule { }