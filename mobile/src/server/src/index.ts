import { getEnv } from '@esliph/util-node'
import { ENV } from './core'
import Bootstrap from './core/bootstrap'
import { GenerateLogin } from './@tests/login'
import { GenerateListenerClient } from './@tests/listener-client-public'

const env = getEnv({ name: 'ENV', defaultValue: ENV.Development }) as ENV

Bootstrap(env)

async function App() {
    const listener = GenerateListenerClient()
    await GenerateLogin(listener)

    await listener.post('PU:categories/create', { name: 'Category 1' })

}

App()