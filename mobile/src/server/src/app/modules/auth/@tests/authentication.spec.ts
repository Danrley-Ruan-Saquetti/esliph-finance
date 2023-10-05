import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Authentication Login', async () => {
    const listenerClient = new ListenerPublicClient()

    const accountArgs = {
        name: 'Dan Ruan',
        login: 'dan@gmail.com',
        password: '123456'
    }

    await listenerClient.post('accounts/create', accountArgs)

    it('Authentication base', async () => {
        const response = await listenerClient.post('accounts/teste', {})

        console.log(response.getError())
        console.log(response.getValue())
    })
})