import { StorageService } from "@services/storage.service";
import { GLOBAL_KEYS } from '@global';

export class TokenService {
    private storage = new StorageService()

    async setTokenCustomer(token: string) {
        const result = await this.storage.set(GLOBAL_KEYS.TOKEN_CUSTOMER, token)

        return result
    }

    async getTokenCustomer() {
        const result = await this.storage.get<string>(GLOBAL_KEYS.TOKEN_CUSTOMER)

        return result
    }

    async deleteTokenCustomer() {
        const result = await this.storage.delete(GLOBAL_KEYS.TOKEN_CUSTOMER)

        return result
    }

    async setTokenBankAccount(token: string) {
        const result = await this.storage.set(GLOBAL_KEYS.TOKEN_BANK_ACCOUNT, token)

        return result
    }

    async getTokenBankAccount() {
        const result = await this.storage.get<string>(GLOBAL_KEYS.TOKEN_BANK_ACCOUNT)

        return result
    }

    async deleteTokenBankAccount() {
        const result = await this.storage.delete(GLOBAL_KEYS.TOKEN_BANK_ACCOUNT)

        return result
    }
}