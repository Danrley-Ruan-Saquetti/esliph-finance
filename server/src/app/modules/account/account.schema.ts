import { ModelSchemaArgs } from '../../../common/model.schema'

export type AccountModelArgs = {
    name: string
    login: string
    password: string
}

export type AccountModel = ModelSchemaArgs & AccountModelArgs
