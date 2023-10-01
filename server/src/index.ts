import { AccountController } from './app/modules/account/account.controller'
import { Application } from './core'

function bootstrap() {
    const app = new Application()

    app.initComponents([AccountController])
}

bootstrap()