import { AppModule } from '@server/app/app.module'
import { Module } from '@esliph/module'
import { Logger } from './services/logger.service'
import { JWTService } from './services/jwt.service'

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