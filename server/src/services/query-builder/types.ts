export enum ParamType {
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    DATE = 'DATE',
    ENUM = 'ENUM'
}
export enum ParamOperation {
    EQUALS = 'eq',
    DIFFERENT = 'dif',
    CONTAINS = 'in',
    NOT_CONTAINS = 'nin',
    FILLED = 'fil',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUAL = 'lte',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUAL = 'gte',
    STARS_WITH = 'sw',
    ENDS_WITH = 'ew',
}

export type TParamType = keyof typeof ParamType
export type TParamOperation = 'eq' | 'in' | 'fil' | 'nin' | 'lt' | 'lte' | 'gt' | 'gte' | 'dif' | 'ew' | 'sw'