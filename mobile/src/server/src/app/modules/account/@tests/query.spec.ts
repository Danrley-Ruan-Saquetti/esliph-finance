import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Query Account', async () => {
    const listenerClient = new ListenerPublicClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', accountArgs)

    it('Query base by id', async () => {
        const account = await listenerClient.get('accounts/find?id', { id: 1 })

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().account.login).toBe(accountArgs.login)
    })

    it('Query base by login', async () => {
        const account = await listenerClient.get('accounts/find?login', { login: accountArgs.login })

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().account.login).toBe(accountArgs.login)
    })

    it('Query All', async () => {
        const account = await listenerClient.get('accounts/find-all', {})

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().accounts.length).toBe(1)
    })
})