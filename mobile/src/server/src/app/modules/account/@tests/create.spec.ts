import { it, expect, describe } from 'vitest'
import { ApplicationClient } from '../../../../services/http/client'
import { EVENT_CONTEXT } from 'src/server/src/services/http/events'
import bootstrap from '../../../../core/bootstrap'

bootstrap()

describe('Create Account', () => {
    const applicationClient = new ApplicationClient<typeof EVENT_CONTEXT.PUBLIC>({})

    it('Create base', async () => {
        const response = await applicationClient.get('accounts/create', {})

        console.log(response)

        expect(1 + 1).toBe(2)
    })
})