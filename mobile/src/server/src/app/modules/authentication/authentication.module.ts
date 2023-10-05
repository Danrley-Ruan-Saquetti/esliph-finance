import { Module } from '../../../common/module'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationRepository } from './authentication.repository'

export class AuthenticationModule extends Module {
    constructor() {
        super({ imports: [], controllers: [AuthenticationController, AuthenticationRepository], services: [] })
    }
}