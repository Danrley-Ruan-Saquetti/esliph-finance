import { describe, expect, test } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { ListenerPublicClient } from '../../../../services/http'
import { Login } from '../../../../@tests/login'

Bootstrap(ENV.Test)

describe('Create Category', async () => {
    const listenerClient = new ListenerPublicClient()

    await Login(listenerClient)

    test('Create base', async () => {
        const response = await listenerClient.post('categories/create')

        expect(response.isSuccess()).toBe(true)
    })
})