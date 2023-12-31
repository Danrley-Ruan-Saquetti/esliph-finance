export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: ID, createdAt: Date, updatedAt: Date }
export type DocumentSimple<ModelType extends object = {}> = Omit<ModelType, keyof Document>

export type PayloadJWTUser = { sub: ID, email: string, name: string }
export type PayloadJWTUserBankAccount = PayloadJWTUser & { bankAccount: number }

export type ClassConstructor<T = any> = new (...args: any[]) => T