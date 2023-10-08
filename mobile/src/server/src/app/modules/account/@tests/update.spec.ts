import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'
import { GenerateLogin } from '../../../../@tests/login'

Bootstrap(ENV.Test)

describe('Update Account', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    test('Update base', async () => {
        const response = await listenerClient.put('accounts/update', { name: 'Teste' })

        const responseAccountUpdated = await listenerClient.get('accounts/find?id', { id: 1 })

        expect(response.isSuccess()).toBe(true)
        expect(responseAccountUpdated.getValue().account.name).toBe('Teste')
        expect(responseAccountUpdated.getValue().account.login).toBe('dan@gmail.com')
    })
})