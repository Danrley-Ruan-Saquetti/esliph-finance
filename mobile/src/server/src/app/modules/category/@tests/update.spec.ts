import { test, expect, describe } from 'vitest'
import Bootstrap from '../../../../core/bootstrap'
import { ENV } from '../../../../core'
import { GenerateListenerClient } from '../../../../@tests/listener-client-public'
import { GenerateLogin } from '../../../../@tests/login'

Bootstrap(ENV.Test)

describe('Update Category', async () => {
    const listenerClient = GenerateListenerClient()

    await GenerateLogin(listenerClient)

    test('Update base', async () => {

    })
})