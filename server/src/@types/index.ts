// Database
export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: ID, createdAt: Date, updatedAt: Date }
export type DocumentSimple<ModelType extends object = {}> = Omit<ModelType, keyof Document>

// JWT Token
export type PayloadJWTAdmin = { sub: ID, peopleId: ID, email: string, name: string }
export type PayloadJWTCustomer = PayloadJWTAdmin
export type PayloadJWTCustomerBankAccount = PayloadJWTCustomer & { bankAccount: number }
export type PayloadJWTCustomerResetPassword = { sub: ID, email: string, name: string }

// Query
export type MetadataQuery = {
    currentPage: number
    itemsPerPage: number
    totalOfItens: number
    totalOfPages: number
}

// Utils
export type ClassConstructor<T = any> = new (...args: any[]) => T
export type GenericObject = { [x: string]: any }