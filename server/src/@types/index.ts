// Database
export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: ID, createdAt: Date, updatedAt: Date }
export type DocumentSimple<ModelType extends object = {}> = Omit<ModelType, keyof Document>

// Query
export type MetadataQuery = {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
}

// JWT Token
export type PayloadJWTCustomer = { sub: ID, peopleId: ID }
export type PayloadJWTBankAccount = { id: ID, slug: string }
export type PayloadJWTCustomerBankAccount = PayloadJWTCustomer & PayloadJWTBankAccount