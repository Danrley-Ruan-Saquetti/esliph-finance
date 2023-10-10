import { Module } from '../../../../common/module'
import { AuthAuthorizationUseCase } from './authorization'
import { AuthLoginUseCase } from './login'

export class AuthUseCaseModule extends Module {
    constructor() {
        super({ services: [AuthLoginUseCase, AuthAuthorizationUseCase] })
    }
}