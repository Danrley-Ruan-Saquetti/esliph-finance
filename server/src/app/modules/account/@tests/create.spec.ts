import { expect, it, describe } from 'vitest'
import { AccountArgs } from '../account.schema'
import {AccountCreateRepository} from '../create/create.repository'
import {AccountCreateService} from '../create/create.service'

describe('Module: Account - Create', () => {
    const accountArgs: AccountArgs = {
        name: 'Dan',
        login: 'dan.ruan@gmail.com',
        password: '12345'
    }

    it('Create Basic', () => {
        const accountCreateRepository = new AccountCreateRepository()
        const accountCreateService = new AccountCreateService(accountCreateRepository)

        const account = accountCreateService.perform(accountArgs)

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().name).toBe('Dan')
    })

    it('Create and Save in Database', () => {
        const accountCreateRepository = new AccountCreateRepository()
        const accountCreateService = new AccountCreateService(accountCreateRepository)

        const account = accountCreateService.perform(accountArgs)

        expect(account.isSuccess()).toBe(true)
        expect(account.getValue().id).toBe(1)
    })
})