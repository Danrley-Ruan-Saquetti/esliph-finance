import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', () => {
    const listenerClient = new ListenerPublicClient()

    it('Create base', async () => {
        const user = {
            name: 'Dan Ruan',
            login: 'dan@gmail.com',
            password: '123'
        }

        const response = await listenerClient.get('accounts/create', user)

        console.log(response)

        expect(1 + 1).toBe(2)
    })
})