import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateLogin } from '../../../../@tests/login'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Authorization Login', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    test('Authorization base', async () => {
        const response = await listenerClient.post('PU:auth/valid-authorization')

        expect(response.isSuccess()).toBe(true)
    })

    test('Authorization without Authorization', async () => {
        const response = await listenerClient.post('PU:auth/valid-authorization', null, { headers: { Authorization: 'Bearer asfsdfdgfd' } })

        expect(response.isSuccess()).toBe(false)
    })
})