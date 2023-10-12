import { ListenerPublicClient } from '../services/http'

export async function GenerateLogin(listenerClient = new ListenerPublicClient(), accountArgs = {
    name: 'Dan Ruan',
    login: 'dan@gmail.com',
    password: '123456'
}) {
    await listenerClient.post('PU:accounts/create', accountArgs)

    const resultLogin = await listenerClient.post('PU:auth/login', { login: 'dan@gmail.com', password: '123456' })

    const { token } = resultLogin.getValue()

    listenerClient.use({ headers: { Authorization: `Bearer ${token}` } })

    return token
}