import { Service } from '@esliph/module'
import { PrismaClient } from '@resources/database/client'
export * from '@resources/database/client'

@Service({ name: 'global.service.database' })
export class DatabaseService extends PrismaClient {}