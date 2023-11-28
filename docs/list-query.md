# Lista de consultas da aplicação

## Conta
findById(id: number)
findByName(name: string)
findByEmail(email: string)
findByIdWithoutPassword(id: number)
findByNameWithoutPassword(name: string)
findByEmailWithoutPassword(email: string)
findMany()

queryByCategoryId(id: number)
queryByNotificationId(id: number)

# Categoria
findById(id: number)
findByName(name: string)
findByColor()
findManyByAccountId(id: number)
findByeIdAndIsFavorite()
findByNameAndIsFavorite()
findByColorAndIsFavorite()
findManyByAccountIdAndIsFavorite()

# Notificação
findById(id: number)
findManyByAccountId(id: number)
