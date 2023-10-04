import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Query Account', async() => {
    const listenerClient = new ListenerPublicClient()

    const account = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', account)

    it('Query base', async () => {
        const account = await listenerClient.get('accounts/find?id', {id: 1})

        console.log(account)

        expect(account.isSuccess()).toBe(true)
    })
})