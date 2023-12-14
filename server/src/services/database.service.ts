export * from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { Service } from '@esliph/module'

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static instance = new PrismaClient()

    get instance() {
        return DatabaseService.instance
    }
}
