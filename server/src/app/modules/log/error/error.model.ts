import * as Database from '@services/database.service'
import { Document } from '@@types'

export namespace LogErrorModel {
    export type LogError = Document
    export type Model = Database.LogError
    export type CreateArgs = Database.Prisma.LogErrorCreateInput
}
