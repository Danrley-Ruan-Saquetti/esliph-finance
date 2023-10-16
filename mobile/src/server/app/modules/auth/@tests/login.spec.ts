import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Login account', async () => {
    const listenerClient = GenerateListenerClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('PU:accounts/create', accountArgs)

    test('Login base', async () => {
        const response = await listenerClient.post('PU:auth/login', { login: 'dan@gmail.com', password: '123456' })

        expect(response.isSuccess()).toBe(true)
    })

    test('Login with login incorrect', async () => {
        const response = await listenerClient.post('PU:auth/login', { login: 'dan@mail.com', password: '123456' })


        expect(response.isSuccess()).toBe(false)
    })

    test('Login with password incorrect', async () => {
        const response = await listenerClient.post('PU:auth/login', { login: 'dan@gmail.com', password: '1234567890' })

        expect(response.isSuccess()).toBe(false)
    })
})