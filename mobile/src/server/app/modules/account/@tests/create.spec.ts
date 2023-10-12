import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Create Account', () => {
    const listenerClient = GenerateListenerClient()

    test('Create base', async () => {
        const account = {
            name: 'Dan Ruan',
            login: 'dan@gmail.com',
            password: '123456'
        }

        const response = await listenerClient.post('PU:accounts/create', account)

        expect(response.isSuccess()).toBe(true)
    })

    test('Try create with data empty', async () => {
        const account = {
            login: 'dan@gmail.com',
            password: '123456'
        }

        const response = await listenerClient.post('PU:accounts/create', account)

        expect(response.isSuccess()).toBe(false)
    })

    test('Try create with data invalid', async () => {
        const account = {
            login: 'dan@gmail.com',
            password: '123'
        }

        const response = await listenerClient.post('PU:accounts/create', account)

        expect(response.isSuccess()).toBe(false)
        expect(response.getError().causes.length).toBe(2)
    })
})