import { Module } from '../../../common/module'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'

export class AuthModule extends Module {
    constructor() {
        super({ imports: [], controllers: [AuthController, AuthRepository], services: [] })
    }
}
