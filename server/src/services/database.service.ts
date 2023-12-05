import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import { DatabaseException, ServerInternalErrorException } from '@common/exceptions'

@Service({ name: 'global.service.database' })
export class DatabaseService {}
