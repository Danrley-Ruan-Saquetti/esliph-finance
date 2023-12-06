export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: ID, createdAt: Date, updatedAt: Date }
export type DocumentSimple<ModelType extends object = {}> = Omit<ModelType, keyof Document>