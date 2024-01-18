import { Service } from '@core'
import { Document } from '@@types'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'



export type CreateQueryArgs<Model extends Document = any> = {
    [x in keyof Model]?: {
        contains?: Model[x][]
        noContains?: Model[x][]
    }
}

@Service({ name: 'global.service.query-builder' })
export class QueryBuilderService {
    createQuery<Model extends Document>(params: CreateQueryArgs<Model>) {

    }
}

const queryBuilder = new QueryBuilderService()

const query: CreateQueryArgs<FinancialTransactionModel.FinancialTransaction> = {
    id: {

    }
}

queryBuilder.createQuery(query)