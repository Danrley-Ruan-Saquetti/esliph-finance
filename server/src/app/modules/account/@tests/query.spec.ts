import { expect, it, describe } from 'vitest'
import { AccountArgs } from '../account.schema'
import {AccountCreateRepository} from '../create/create.repository'
import {AccountCreateService} from '../create/create.service'
import { AccountQueryRepository } from '../query/query.repository'
import { AccountQueryService } from '../query/query.service'

describe('Module: Account - Query', () => {
    const accountArgs: AccountArgs = {
        name: 'Dan',
        login: 'dan.ruan@gmail.com',
        password: '12345'
    }

    const accountCreateRepository = new AccountCreateRepository(false)
    const accountCreateService = new AccountCreateService(accountCreateRepository)

    accountCreateService.perform(accountArgs)
    accountCreateService.perform(accountArgs)
    accountCreateService.perform(accountArgs)
    accountCreateService.perform(accountArgs)

    it('Query Basic', () => {
        const accountQueryRepository = new AccountQueryRepository(false)
        const accountQueryService = new AccountQueryService(accountQueryRepository)

        const accounts = accountQueryService.perform()

        expect(accounts.isSuccess()).toBe(true)
        expect(accounts.getValue().length).toBe(4)
    })
})