import { AppModule } from './app/app.module'
import { Application } from './core'

function bootstrap() {
    const app = new Application(AppModule)

    app.initComponents()
}

bootstrap()