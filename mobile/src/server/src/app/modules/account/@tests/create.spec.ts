import { it, expect, describe } from 'vitest'
import { ListenerPublicClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', () => {
    const applicationClient = new ListenerPublicClient()

    it('Create base', async () => {
        const response = await applicationClient.get('accounts/create', {})

        console.log(response)

        expect(1 + 1).toBe(2)
    })
})