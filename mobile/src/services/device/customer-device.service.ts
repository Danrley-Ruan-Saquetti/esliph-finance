import { GLOBAL_KEYS } from "@global";
import { CustomerModel } from "@@types/customer";
import { StorageService } from "@services/storage.service";
import { DeviceService } from "@services/device/device.service";

export class CustomerDeviceService extends DeviceService {
    protected storage = new StorageService()

    constructor() {
        super()
    }

    async registerCustomerInDevice(customer: CustomerModel) {
        const customerInDeviceResult = await this.getCustomerInDevice()

        if (customerInDeviceResult.isErrorOperational()) {
            return customerInDeviceResult
        }

        await this.storage.update(GLOBAL_KEYS.CUSTOMER_IN_DEVICE, customer)
    }

    async getCustomerInDevice() {
        const customersResult = await this.storage.get<CustomerModel>(GLOBAL_KEYS.CUSTOMER_IN_DEVICE)

        return customersResult
    }
}