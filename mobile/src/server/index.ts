import Bootstrap from './core/bootstrap'
import { ListenerPublicClient } from './services/http'

Bootstrap(process.env.ENV as any)

async function App() {
    const listener = new ListenerPublicClient()

    const resultCreate = await listener.post('PU:accounts/create', {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456',
    })

    if (!resultCreate.isSuccess()) {
        return
    }

    const resultLogin = await listener.post('PU:auth/login', { login: 'dan@gmail.com', password: '123456' })

    if (!resultLogin.isSuccess()) {
        return
    }

    const { token } = resultLogin.getValue()

    listener.use({ headers: { Authorization: `Bearer ${token}` } })

    await listener.post('PU:categories/create', { name: 'Category 1' })
}

App()
