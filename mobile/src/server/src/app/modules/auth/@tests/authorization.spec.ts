import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Authorization Login', async () => {
    const listenerClient = new ListenerPublicClient({origem: 'TESTE'})

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', accountArgs)

    it('Authorization base', async () => {
        const response = await listenerClient.post('accounts/teste', {})

        expect(response.isSuccess()).toBe(true)
    })
})