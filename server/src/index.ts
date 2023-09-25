import { AppModule } from './app/app.module'
import { Factory } from './core'
import './service/database'

function bootstrap() {
    const app = Factory.createFactory(AppModule)
}

bootstrap()
