import { it, expect, describe } from 'vitest'
import { ApplicationClient } from '../../../../services/http/client'
import bootstrap from '../../../../core/bootstrap'
import { CONTEXT_TYPE } from 'src/server/src/services/http/events'

bootstrap()

describe('Create Account', () => {
    const applicationClient = new ApplicationClient<CONTEXT_TYPE['PUBLIC']>({context: 'PUBLIC'})

    it('Create base', async () => {
        const response = await applicationClient.get('accounts/hello')

        console.log(response)

        expect(1 + 1).toBe(2)
    })
})