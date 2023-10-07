import { describe, expect, test } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateLogin } from '../../../../@tests/login'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'

Bootstrap(ENV.Test)

describe('Create Category', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    test('Create base', async () => {
        const categoryArgs = { name: 'Categoria de Exemplo', isFavorite: true }

        const response = await listenerClient.post('categories/create', categoryArgs)

        console.log(response.getError() || response.getValue())

        expect(response.isSuccess()).toBe(true)
    })
})