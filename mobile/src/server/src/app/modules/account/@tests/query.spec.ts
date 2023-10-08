import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Query Account', async () => {
    const listenerClient = GenerateListenerClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('PU:accounts/create', accountArgs)

    test('Query base by id', async () => {
        const account = await listenerClient.get('PU:accounts/find?id', { id: 1 })

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().account.login).toBe(accountArgs.login)
    })

    test('Query base by login', async () => {
        const account = await listenerClient.get('PU:accounts/find?login', { login: accountArgs.login })

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().account.login).toBe(accountArgs.login)
    })

    test('Query All', async () => {
        const account = await listenerClient.get('PU:accounts/find-all', {})

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().accounts.length).toBe(1)
    })
})