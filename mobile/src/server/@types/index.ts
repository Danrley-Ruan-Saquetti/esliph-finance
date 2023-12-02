export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: number, createdAt: Date, updatedAt: Date }
