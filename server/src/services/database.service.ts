import { Service } from '@esliph/module'
import { DatabaseException, ServerInternalErrorException } from '@common/exceptions'
import { PrismaClient } from '@prisma/client'

@Service({ name: 'global.service.database' })
export class DatabaseService extends PrismaClient {}
