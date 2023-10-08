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
        const categoryArgs = { name: 'Categoria de Exemplo', isFavorite: true, accentColor: '#ff0000' }

        const response = await listenerClient.post('@:categories/create', categoryArgs)

        expect(response.isSuccess()).toBe(true)
    })

    test('Create without name', async () => {
        const categoryArgs = { name: '' }

        const response = await listenerClient.post('@:categories/create', categoryArgs)

        expect(response.isSuccess()).toBe(false)
    })

    test('Create without account id', async () => {
        const categoryArgs = { name: 'Categoria de Exemplo', isFavorite: true, accentColor: '#ff0000' }

        const response = await listenerClient.post('@:categories/create', categoryArgs, { headers: { Authorization: '' } })

        expect(response.isSuccess()).toBe(false)
    })
})