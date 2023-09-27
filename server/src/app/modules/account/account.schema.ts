import { RepositoryEsliph } from '@esliph/util-node'

export interface AccountArgs {
    name: string
    login: string
    password: string
}

export interface AccountModel extends RepositoryEsliph.Document {
    name: string
    login: string
    password: string
}