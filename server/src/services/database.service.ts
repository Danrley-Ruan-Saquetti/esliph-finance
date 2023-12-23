export * from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { Service } from '@esliph/module'

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static instance = new PrismaClient({
        log: [
            { level: 'error', emit: 'event' },
            { level: 'info', emit: 'event' },
            { level: 'query', emit: 'stdout' },
            { level: 'warn', emit: 'event' },
        ]
    })

    get instance() {
        return DatabaseService.instance
    }
}
