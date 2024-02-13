import { TokenService } from "@services/token.service"
import { ApiService } from "@services/api.service"

export class AuthenticationService {
    private tokenService = new TokenService()

    async setTokenCustomer(token: string) {
        const result = await this.tokenService.setTokenCustomer(token)

        if (result.isSuccess()) {
            this.setTokenInHeader('Authorization', token)
        }

        return result
    }

    async getTokenCustomer() {
        const result = await this.tokenService.getTokenCustomer()

        return result
    }

    async deleteTokenCustomer() {
        const result = await this.tokenService.deleteTokenCustomer()

        if (result.isSuccess()) {
            this.removeTokenInHeader('Authorization')

            const result = await this.deleteTokenBankAccount()

            if (!result.isSuccess()) {
                return result
            }
        }

        return result
    }

    async hasTokenCustomer() {
        const result = await this.tokenService.deleteTokenCustomer()

        return result.isSuccess()
    }

    async setTokenBankAccount(token: string) {
        const result = await this.tokenService.setTokenBankAccount(token)

        if (result.isSuccess()) {
            this.setTokenInHeader('AuthorizationBankAccount', token)
        }

        return result
    }

    async getTokenBankAccount() {
        const result = await this.tokenService.getTokenBankAccount()

        return result
    }

    async deleteTokenBankAccount() {
        const result = await this.tokenService.deleteTokenBankAccount()

        if (result.isSuccess()) {
            this.removeTokenInHeader('AuthorizationBankAccount')
        }

        return result
    }

    async hasTokenBankAccount() {
        const result = await this.tokenService.deleteTokenBankAccount()

        return result.isSuccess()
    }

    async syncHeadersWithStorage() {
        const tokenCustomerResult = await this.tokenService.getTokenCustomer()

        if (!tokenCustomerResult.isSuccess()) {
            return
        }

        const tokenBankAccountResult = await this.tokenService.getTokenBankAccount()

        if (!tokenBankAccountResult.isSuccess()) {
            return
        }

        this.setTokenInHeader('Authorization', tokenCustomerResult.getValue())
        this.setTokenInHeader('AuthorizationBankAccount', tokenBankAccountResult.getValue())
    }

    private setTokenInHeader(key: string, token: string) {
        if (!ApiService.globalOptions.headers) {
            ApiService.globalOptions.headers = {}
        }
        ApiService.globalOptions.headers[key] = `Bearer ${token}`
    }

    private removeTokenInHeader(key: string) {
        if (ApiService.globalOptions.headers) {
            delete ApiService.globalOptions.headers[key]
        }
    }
}