Lista de consultas da aplicação

# Account

## Model

- AccountModel
name: string
email: string
password: string
balance: number

- Account
id: number
name: string
email: string
password: string
balance: number
createAt: Date
updateAt: Date

- AccountWithoutPassword
id: number
name: string
email: string
balance: number
createAt: Date
updateAt: Date

## Queries
findById(id: number)
findByName(name: string)
findByEmail(email: string)
findByIdWithoutPassword(id: number)
findByNameWithoutPassword(name: string)
findByEmailWithoutPassword(email: string)
findMany()

queryByCategoryId(id: number)
queryByNotificationId(id: number)

# Category

## Model

- AccountModel

findById(id: number)
findByName(name: string)
findByColor()
findManyByAccountId(id: number)
findByeIdAndIsFavorite()
findByNameAndIsFavorite()
findByColorAndIsFavorite()
findManyByAccountIdAndIsFavorite()

# Notification
findById(id: number)
findManyByAccountId(id: number)
