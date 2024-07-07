import { isUndefined } from '@util/types'
import { ParamType } from '@services/query-builder/types'

function isValidOperator(operator: any, nameOperator: string, excludesOperators: string[] = []) {
    return !isUndefined(operator) && !excludesOperators.includes(nameOperator)
}

export const GLOBAL_QUERY_SEARCH_HANDLER_VALUES = {
    [ParamType.STRING]: ({ eq, sw, ew, in: In, nin, dif }: any = {}, { excludesOperators = [] }: { excludesOperators?: string[] } = {}) => {
        const filtersArgs: any = {
            ...(isValidOperator(eq, 'eq', excludesOperators) && { equals: eq }),
            ...(isValidOperator(sw, 'sw', excludesOperators) && { startsWith: sw }),
            ...(isValidOperator(ew, 'ew', excludesOperators) && { endsWith: ew }),
            ...(isValidOperator(In, 'in', excludesOperators) && { contains: In }),
            ...((nin || dif) && {
                not: {
                    ...(isValidOperator(nin, 'nin', excludesOperators) && { contains: nin }),
                    ...(isValidOperator(dif, 'dif', excludesOperators) && { equals: dif })
                }
            })
        }

        if (Object.keys(filtersArgs).length == 0)
            return {}

        return { ...filtersArgs, mode: 'insensitive' }
    },
    [ParamType.DATE]: ({ eq, gt, lt, gte, lte, dif }: any = {}, { excludesOperators = [] }: { excludesOperators?: string[] } = {}) => ({
        ...(isValidOperator(eq, 'eq', excludesOperators) && { equals: eq }),
        ...(isValidOperator(gt, 'gt', excludesOperators) && { gt: gt }),
        ...(isValidOperator(lt, 'lt', excludesOperators) && { lt: lt }),
        ...(isValidOperator(gte, 'gte', excludesOperators) && { gte: gte }),
        ...(isValidOperator(lte, 'lte', excludesOperators) && { lte: lte }),
        ...(dif && { not: { ...(!excludesOperators.includes('dif') && { equals: dif }) } })
    }),
    [ParamType.NUMBER]: ({ eq, gt, lt, gte, lte, in: In, nin, dif }: any = {}, { excludesOperators = [] }: { excludesOperators?: string[] } = {}) => ({
        ...(isValidOperator(eq, 'eq', excludesOperators) && { equals: eq }),
        ...(isValidOperator(gt, 'gt', excludesOperators) && { gt: gt }),
        ...(isValidOperator(lt, 'lt', excludesOperators) && { lt: lt }),
        ...(isValidOperator(gte, 'gte', excludesOperators) && { gte: gte }),
        ...(isValidOperator(lte, 'lte', excludesOperators) && { lte: lte }),
        ...(isValidOperator(In, 'in', excludesOperators) && { in: In }),
        ...((nin || dif) && {
            not: {
                ...(isValidOperator(nin, 'nin', excludesOperators) && { in: nin }),
                ...(isValidOperator(dif, 'dif', excludesOperators) && { equals: dif })
            }
        })
    }),
    [ParamType.BOOLEAN]: ({ eq, dif }: any = {}, { excludesOperators = [] }: { excludesOperators?: string[] } = {}) => ({
        ...(isValidOperator(eq, 'eq', excludesOperators) && { equals: eq }),
        ...(isValidOperator(dif, 'dif', excludesOperators) && { not: { equals: dif } }),
    }),
    [ParamType.ENUM]: ({ eq, in: In, nin, dif }: any = {}, { excludesOperators = [] }: { excludesOperators?: string[] } = {}) => ({
        ...(isValidOperator(eq, 'eq', excludesOperators) && { equals: eq }),
        ...(isValidOperator(In, 'in', excludesOperators) && { in: In }),
        ...(isValidOperator(dif, 'dif', excludesOperators) && { not: { equals: dif } }),
        ...(isValidOperator(nin, 'nin', excludesOperators) && { notIn: nin }),
    }),
}