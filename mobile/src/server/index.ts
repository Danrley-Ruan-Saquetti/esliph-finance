import Bootstrap from './core/bootstrap'
import { GenerateLogin } from './@tests/login'
import { GenerateListenerClient } from './@tests/listener-client-public'

Bootstrap(process.env.ENV as any)

async function App() {
    const listener = GenerateListenerClient()
    await GenerateLogin(listener)

    await listener.post('PU:categories/create', { name: 'Category 1' })

}

App()