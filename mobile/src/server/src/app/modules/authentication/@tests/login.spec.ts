import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', async () => {
    const listenerClient = new ListenerPublicClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', accountArgs)

    it('Login base', async () => {
        const response = await listenerClient.post('authentication/login', { login: 'dan@gmail.com', password: '123456' })

        expect(response.isSuccess()).toBe(true)
    })

    it('Login with login incorrect', async () => {
        const response = await listenerClient.post('authentication/login', { login: 'dan@mail.com', password: '123456' })

        expect(response.isSuccess()).toBe(false)
    })

    it('Login with password incorrect', async () => {
        const response = await listenerClient.post('authentication/login', { login: 'dan@gmail.com', password: '1234567890' })

        expect(response.isSuccess()).toBe(false)
    })
})