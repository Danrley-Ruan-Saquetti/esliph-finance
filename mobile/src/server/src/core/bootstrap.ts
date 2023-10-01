import { AppModule } from '../app/app.module'
import { Application } from './app'

export default function bootstrap() {
    const app = new Application(AppModule)

    app.initComponents()
}