import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { DatabaseService } from '@server/services/database.service'
import { AccountModel, AccountEntity } from '@modules/account/account.model'

@Service({ name: 'account.use-case.create' })
export class AccountCreateUseCase {
    constructor(@Injection.Inject('database') private database: DatabaseService) { }

    async findById(id: number) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${AccountEntity.ModelName} WHERE ${AccountEntity.Attributes.ID} = ?`, [id])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o ID "${id}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByName(name: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${AccountEntity.ModelName} WHERE ${AccountEntity.Attributes.NAME} = ?`, [name])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o Nome "${name}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByEmail(email: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${AccountEntity.ModelName} WHERE ${AccountEntity.Attributes.EMAIL} = ?`, [email])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o E-mail "${email}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByIdWithoutPassword(id: number) {
        const accountResult = await this.database.queryOne<AccountModel.WithoutPassword>(`SELECT ${AccountEntity.AccountWithoutPasswordNames.join(', ')} FROM ${AccountEntity.ModelName} WHERE ${AccountEntity.Attributes.ID} = ?`, [id])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o ID "${id}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByNameWithoutPassword(name: string) { }

    async findByEmailWithoutPassword(email: string) { }

    async findMany() { }

    async findManyWithoutPassword() { }
}
