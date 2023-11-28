# Model

## AccountModel
name: string
email: string
password: string
balance: number

## Account
id: number
name: string
email: string
password: string
balance: number
createAt: Date
updateAt: Date

## AccountWithoutPassword
id: number
name: string
email: string
balance: number
createAt: Date
updateAt: Date

# Use Case
register(args: { name: string, email: string, password: string }): { message: string, ok: boolean }

update(args: { name?: string, email?: string, password?: string }): { message: string, ok: boolean }

findById(id: number): Account
findByName(name: string): Account
findByEmail(email: string): Account
findByIdWithoutPassword(id: number): AccountWithoutPassword
findByNameWithoutPassword(name: string): AccountWithoutPassword
findByEmailWithoutPassword(email: string): AccountWithoutPassword
findMany(): Account[]
findManyWithoutPassword(): AccountWithoutPassword[]

queryByCategoryId(id: number): AccountWithoutPassword
queryByNotificationId(id: number): AccountWithoutPassword