import { AppModule } from '../app/app.module'
import { Application, ENV } from './app'

export default function Bootstrap(env = ENV.Development) {
    const app = new Application(AppModule, env)

    app.initComponents()
}