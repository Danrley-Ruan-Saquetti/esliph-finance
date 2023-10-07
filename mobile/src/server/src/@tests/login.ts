import { ListenerPublicClient } from '../services/http'

export async function GenerateLogin(listenerClient = new ListenerPublicClient(), accountArgs = {
    name: 'Dan Ruan',
    login: 'dan@gmail.com',
    password: '123456'
}) {
    await listenerClient.post('accounts/create', accountArgs)

    const resultLogin = await listenerClient.post('auth/login', { login: 'dan@gmail.com', password: '123456' })

    const { token } = resultLogin.getValue()

    listenerClient.use({ headers: { Authorization: `Bearer ${token}` } })

    return token
}