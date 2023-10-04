import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', () => {
    const listenerClient = new ListenerPublicClient()

    it('Create base', async () => {
        const account = {
            name: 'Dan Ruan',
            login: 'dan@gmail.com',
            password: '123456'
        }

        const response = await listenerClient.post('accounts/create', account)

        expect(response.isSuccess()).toBe(true)
    })

    it('Try create with data empty', async () => {
        const account = {
            login: 'dan@gmail.com',
            password: '123456'
        }

        const response = await listenerClient.post('accounts/create', account)

        expect(response.isSuccess()).toBe(false)
    })

    it('Try create with data invalid', async () => {
        const account = {
            login: 'dan@gmail.com',
            password: '123'
        }

        const response = await listenerClient.post('accounts/create', account)

        expect(response.isSuccess()).toBe(false)
        expect(response.getError().causes.length).toBe(2)
    })
})