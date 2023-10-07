import { test, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { Login } from '../../../../@tests/login'

Bootstrap(ENV.Test)

describe('Authorization Login', async () => {
    const listenerClient = new ListenerPublicClient()

    await Login(listenerClient)

    test('Authorization base', async () => {
        const response = await listenerClient.post('auth/valid-authorization')

        expect(response.isSuccess()).toBe(true)
    })

    test('Authorization without Authorization', async () => {
        const response = await listenerClient.post('auth/valid-authorization', null, { headers: { Authorization: 'Bearer asfsdfdgfd' } })

        expect(response.isSuccess()).toBe(false)
    })
})