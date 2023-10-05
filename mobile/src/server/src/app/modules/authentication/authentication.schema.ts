export interface AuthenticationSchema {
    name: string
    login: string
    password: string
}

export interface AuthenticationSchemaWithoutPassword {
    name: string
    login: string
}
