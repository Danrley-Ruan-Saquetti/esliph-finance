export type ID = number

export type Document<ModelType extends object = {}> = ModelType & { id: number, createAt: Date, updateAt: Date }
