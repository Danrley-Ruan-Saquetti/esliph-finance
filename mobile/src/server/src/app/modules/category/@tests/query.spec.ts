import { describe, expect, test } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateLogin } from '../../../../@tests/login'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Query Category', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    await listenerClient.post('categories/create', { name: 'Category 1', order: 1, isFavorite: true })
    await listenerClient.post('categories/create', { name: 'Category 2', order: 1 })
    await listenerClient.post('categories/create', { name: 'Category 3', order: 1, isFavorite: true })
    await listenerClient.post('categories/create', { name: 'Category 4', order: 2 })
    await listenerClient.post('categories/create', { name: 'Category 5', order: 1 })

    test('Query base', async () => {
        const response = await listenerClient.get('categories/find-all')

        console.log(response.getValue().categories)
    })
})