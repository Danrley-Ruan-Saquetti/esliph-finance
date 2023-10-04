export interface AccountSchema {
    name: string
    login: string
    password: string
}

export interface AccountSchemaWithoutPassword {
    name: string
    login: string
}
