import { StorageService } from "@services/storage.service";
import { ApiService } from "./api.service";

const KEY_TOKEN_CUSTOMER = 'global.key.token.customer'
const KEY_TOKEN_BANK_ACCOUNT = 'global.key.token.bank-account'

export class TokenService {
    private storage = new StorageService()

    async setTokenCustomer(token: string) {
        const result = await this.storage.set(KEY_TOKEN_CUSTOMER, token)

        if (result.isSuccess()) {
            if (!ApiService.globalOptions.headers) {
                ApiService.globalOptions.headers = {}
            }
            ApiService.globalOptions.headers['Authorization'] = `Bearer ${token}`
        }

        return result
    }

    async getTokenCustomer() {
        const result = await this.storage.get<string>(KEY_TOKEN_CUSTOMER)

        return result
    }

    async deleteTokenCustomer() {
        const result = await this.storage.delete(KEY_TOKEN_CUSTOMER)

        if (result.isSuccess()) {
            if (ApiService.globalOptions.headers) {
                delete ApiService.globalOptions.headers['Authorization']
            }
        }

        return result
    }

    async setTokenBankAccount(token: string) {
        const result = await this.storage.set(KEY_TOKEN_BANK_ACCOUNT, token)

        if (result.isSuccess()) {
            if (!ApiService.globalOptions.headers) {
                ApiService.globalOptions.headers = {}
            }
            ApiService.globalOptions.headers['AuthorizationBankAccount'] = `Bearer ${token}`
        }

        return result
    }

    async getTokenBankAccount() {
        const result = await this.storage.get<string>(KEY_TOKEN_BANK_ACCOUNT)

        return result
    }

    async deleteTokenBankAccount() {
        const result = await this.storage.delete(KEY_TOKEN_BANK_ACCOUNT)

        if (result.isSuccess()) {
            if (ApiService.globalOptions.headers) {
                delete ApiService.globalOptions.headers['AuthorizationBankAccount']
            }
        }

        return result
    }
}