import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Authorization Login', async () => {
    const listenerClient = new ListenerPublicClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', accountArgs)

    const resultLogin = await listenerClient.post('auth/login', { login: 'dan@gmail.com', password: '123456' })

    const { token } = resultLogin.getValue()

    listenerClient.use({ headers: { Authorization: `Bearer ${token}` } })

    it('Authorization base', async () => {
        const response = await listenerClient.post('auth/valid-authorization')

        expect(response.isSuccess()).toBe(true)
    })

    it('Authorization without Authorization', async () => {
        const response = await listenerClient.post('auth/valid-authorization', null, { headers: { Authorization: 'Bearer asfsdfdgfd' } })

        expect(response.isSuccess()).toBe(false)
    })
})