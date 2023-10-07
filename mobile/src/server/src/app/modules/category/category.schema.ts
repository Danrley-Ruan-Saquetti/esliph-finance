export interface CategorySchema {
    name: string
    login: string
    password: string
}

export interface CategorySchemaWithoutPassword {
    name: string
    login: string
}
