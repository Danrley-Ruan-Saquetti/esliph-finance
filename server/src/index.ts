import { AppModule } from './app/app.module'
import { Factory } from './core'
import './service/database'
import { Schema } from './service/database/schema'

function bootstrap() {
    const app = Factory.createFactory(AppModule)
}

bootstrap()

new Schema('teste', ['name TEXT', 'login TEXT', 'password TEXT']).create()
