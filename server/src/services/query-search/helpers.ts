import { QueryParamType, QueryType } from '@services/query-search/types'
import { NumberHandlerHelper } from '@services/query-search/number.helper'
import { BooleanHandlerHelper } from '@services/query-search/boolean.helper'
import { StringHandlerHelper } from '@services/query-search/string.helper'
import { DateHandlerHelper } from '@services/query-search/date.helper'

export const HANDLER_TYPE_PARAM: { [x in QueryParamType]: any } = {
    [QueryType.NUMBER]: NumberHandlerHelper,
    [QueryType.BOOLEAN]: BooleanHandlerHelper,
    [QueryType.STRING]: StringHandlerHelper,
    [QueryType.DATE]: DateHandlerHelper,
} as const
