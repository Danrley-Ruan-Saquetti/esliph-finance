import { it, expect, describe } from 'vitest'
import { ApplicationClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', () => {
    const applicationClient = new ApplicationClient()

    it('Create base', async () => {
        const response = await applicationClient.get('accounts/hello')

        console.log(response)

        expect(1 + 1).toBe(2)
    })
})