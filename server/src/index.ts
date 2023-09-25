import { AppModule } from './app/app.module'
import { Factory } from './core'

function bootstrap() {
    const app = Factory.createFactory(AppModule)
}

bootstrap()
