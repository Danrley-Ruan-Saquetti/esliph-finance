import { Module } from '../common/module'
import { AuthModule } from './modules/auth/auth.module'
import { AccountModule } from './modules/account/account.module'
import { CategoryModule } from './modules/category/category.module'
import { ListenerPrivateClient, ListenerPublicClient, ListenerRepositoryClient } from './../services/http/client'
import { ListenerPrivateServer, ListenerPublicServer, ListenerRepositoryServer } from './../services/http/server'

export class AppModule extends Module {
    constructor() {
        super({
            imports: [AuthModule, AccountModule, CategoryModule],
            services: [
                ListenerPrivateClient,
                ListenerPublicClient,
                ListenerRepositoryClient,
                ListenerPrivateServer,
                ListenerPublicServer,
                ListenerRepositoryServer,
            ],
        })
    }
}
