import { GLOBAL_KEYS } from "@global";
import { Result } from "@lib/common";
import { ID } from "@@types";
import { BankAccountModel } from "@@types/bank-account";
import { StorageService } from "@services/storage.service";
import { DeviceService } from "@services/device/device.service";

export class BankAccountDeviceService extends DeviceService {
    protected storage = new StorageService()

    constructor() {
        super()
    }

    async registerBankAccountInDevice(bankAccount: BankAccountModel) {
        const bankAccountsInDeviceResult = await this.getBankAccountsInDevice()

        if (bankAccountsInDeviceResult.isErrorOperational()) {
            return bankAccountsInDeviceResult
        }

        const bankAccountsInDevice = [
            ...(bankAccountsInDeviceResult.getValue() || []),
            bankAccount
        ]

        await this.storage.update(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE, bankAccountsInDevice)
    }

    async getBankAccountsInDevice() {
        const bankAccountsResult = await this.storage.get<BankAccountModel[]>(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE)

        return bankAccountsResult
    }

    async removeBankAccountInDeviceById(id: ID) {
        const bankAccountsResult = await this.storage.get<BankAccountModel[]>(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE)

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure({ ...bankAccountsResult.getError() })
        }

        const bankAccounts = bankAccountsResult.getValue() || []

        const bankAccountIndex = bankAccounts.findIndex((account) => account.id == id)

        if (bankAccountIndex < 0) {
            return Result.failure({ title: 'Query Bank Account in Device', message: 'Bank Account not found' })
        }

        bankAccounts.splice(bankAccountIndex, 1)

        await this.storage.update(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE, bankAccounts)

        return Result.success({ message: 'Bank Account removed with success' })
    }

    async clearBankAccountsInDevice() {
        await this.storage.delete(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE)
    }

    async getBankAccountInDeviceById(id: ID) {
        const bankAccountsResult = await this.storage.get<BankAccountModel[]>(GLOBAL_KEYS.BANK_ACCOUNTS_IN_DEVICE)

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure<BankAccountModel>({ ...bankAccountsResult.getError() })
        }

        const bankAccount = (bankAccountsResult.getValue() || []).find((account) => account.id == id)

        if (!bankAccount) {
            return Result.failure<BankAccountModel>({ title: 'Query Bank Account in Device', message: 'Bank Account not found' })
        }

        return Result.success<BankAccountModel>(bankAccount)
    }
}