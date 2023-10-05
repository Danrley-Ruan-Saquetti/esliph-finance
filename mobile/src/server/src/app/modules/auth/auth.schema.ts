export interface AuthSchema {
    name: string
    login: string
    password: string
}

export interface AuthSchemaWithoutPassword {
    name: string
    login: string
}
