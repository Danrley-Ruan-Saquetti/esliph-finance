import { Module } from '../../../common/module'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'

export class AuthModule extends Module {
    constructor() {
        super({ imports: [], controllers: [AuthController, AuthRepository], services: [AuthService] })
    }
}
