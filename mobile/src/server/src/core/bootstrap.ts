import { AppModule } from '../app/app.module'
import { Application, ENV } from './app'

export default function Bootstrap(env = ENV.Production) {
    const app = new Application(AppModule, env)

    app.initComponents()
}