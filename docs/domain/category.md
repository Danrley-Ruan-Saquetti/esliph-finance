# Category

## Model

### AccountModel
accountId: number
name: string
color: string
isFavorite: boolean

### Account
id: number
accountId: number
name: string
color: string
isFavorite: boolean
createAt: Date
updateAt: Date

## Query

findById(id: number)
findByName(name: string)
findByColor()
findManyByAccountId(id: number)
findByeIdAndIsFavorite()
findByNameAndIsFavorite()
findByColorAndIsFavorite()
findManyByAccountIdAndIsFavorite()