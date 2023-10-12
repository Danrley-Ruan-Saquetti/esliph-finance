import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'
import { GenerateLogin } from '../../../../@tests/login'

Bootstrap(ENV.Test)

describe('Update Category', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    await listenerClient.post('PU:categories/create', { name: 'Categoria 1' })

    test('Update base', async () => {
        const response = await listenerClient.put('PU:categories/update', { accentColor: '#ff0000', isFavorite: true }, { headers: { categoryId: 1 } })

        const responseCategory = await listenerClient.get('PU:categories/find?id', { id: 1 })

        expect(response.isSuccess()).toBe(true)
        expect(responseCategory.getValue().category.isFavorite).toBe(true)
        expect(responseCategory.getValue().category.accentColor).toBe('#ff0000')
    })
})