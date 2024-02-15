import { Module } from '@core'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { ValidatorService } from '@services/validator.service'
import { DatabaseService } from '@services/database.service'
import { MailService } from '@services/mail.service'
import { CodeGeneratorService } from '@services/code-generator.service'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
import { HttpLocal, HttpService } from '@services/http.service'
import { MaskDataService } from '@services/mask-data.service'
import { JobService } from '@services/job.service'
import { DateService } from '@services/date.service'
import { FormatterItinCnpjService } from '@services/formatter-itin-cnpj.service'
import { ApiService } from '@services/api.service'
import { EmitterEventService } from '@services/emitter-event.service'
import { ListenerEventService } from '@services/listener-event.service'
import { QuerySearchService } from '@services/query-search.service'

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
        JobService,
        DateService,
        FormatterItinCnpjService,
        ApiService,
        EmitterEventService,
        ListenerEventService,
        HttpLocal,
        QuerySearchService,
        { whenCall: 'query-search', use: 'global.service.query-search' },
        { whenCall: 'http-local', use: 'global.service.http-local' },
        { whenCall: 'listener-event', use: 'global.service.listener-event' },
        { whenCall: 'emitter-event', use: 'global.service.emitter-event' },
        { whenCall: 'api', use: 'global.service.api' },
        { whenCall: 'formatter-itin-cnpj', use: 'global.service.formatter-itin-cnpj' },
        { whenCall: 'date', use: 'global.service.date' },
        { whenCall: 'job', use: 'global.service.job' },
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
