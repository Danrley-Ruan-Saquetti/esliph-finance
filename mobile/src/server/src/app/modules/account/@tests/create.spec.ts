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

        expect(response.isSuccess()).toBe(true)
    })

    it('Try create with data empty', async () => {
        const user = {
            login: 'dan@gmail.com',
            password: '123'
        }

        const response = await listenerClient.get('accounts/create', user)

        expect(response.isSuccess()).toBe(false)
    })

    it('Try create with data invalid', async () => {
        const user = {
            name: 'Dan',
            login: 'dan@gmail.com',
            password: '123'
        }

        const response = await listenerClient.get('accounts/create', user)

        expect(response.isSuccess()).toBe(false)
    })
})