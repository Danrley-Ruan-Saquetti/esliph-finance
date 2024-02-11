import { ApiService } from '@services/api.service'

export class PortalFinanceRepository extends ApiService {
    constructor() {
        super({ baseURL: 'http://192.168.1.10:8080' })
    }
}

export const APIPortal = new PortalFinanceRepository()