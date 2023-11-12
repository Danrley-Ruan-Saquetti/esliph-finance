import { Module } from '@esliph/module'
import { AppModule } from '@server/app/app.module'
import { Logger } from '@server/services/logger.service'
import { JWTService } from '@server/services/jwt.service'

@Module({
    imports: [AppModule],
    providers: [
        Logger,
        JWTService,
        { whenCall: 'logger', use: 'global.service.logger' },
        { whenCall: 'jwt', use: 'global.service.jwt' }
    ]
})
export class MainModule { }