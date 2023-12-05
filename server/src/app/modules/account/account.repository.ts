import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { DatabaseService } from '@services/database.service'
import { AccountModel, AccountEntity } from '@modules/account/account.model'
import { Repository } from '@services/repository.service'
import { ID } from '@@types'

@Service({ name: 'account.repository' })
export class AccountRepository extends Repository {
    constructor(@Injection.Inject('database') private database: DatabaseService) {
        super(AccountEntity.ModelName)
    }

    async register(args: AccountModel.Model) {
        const registerAccountResult = await this.database.exec<AccountModel.Model>(`INSERT INTO ${this.modelName} (${this.prepareStatementNames(args)})`, [
            ...this.prepareStatementValues(args),
        ])

        if (!registerAccountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Registrar Conta', message: 'Não foi possível registrar a conta' })
        }

        return Result.success(registerAccountResult.getValue())
    }

    async updateById(args: AccountModel.Model, where: { id: ID }) {
        const updateAccountResult = await this.database.exec<AccountModel.Model>(
            `UPDATE ${this.modelName} SET ${this.prepareStatementNamesToUpdate(args)} WHERE ${AccountEntity.Attributes.ID} = ?`,
            [...this.prepareStatementValues(args), where.id],
        )

        if (!updateAccountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Atualizar Conta', message: 'Não foi possível atualizar a conta' })
        }

        return Result.success(updateAccountResult.getValue())
    }

    async findById(id: ID) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${this.modelName} WHERE ${AccountEntity.Attributes.ID} = ?`, [id])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o ID "${id}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByName(name: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${this.modelName} WHERE ${AccountEntity.Attributes.NAME} = ?`, [
            name,
        ])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o Nome "${name}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByEmail(email: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(`SELECT * FROM ${this.modelName} WHERE ${AccountEntity.Attributes.EMAIL} = ?`, [
            email,
        ])

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o E-mail "${email}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByIdWithoutPassword(id: ID) {
        const accountResult = await this.database.queryOne<AccountModel.WithoutPassword>(
            `SELECT ${AccountEntity.AccountWithoutPasswordAttributes.join(', ')} FROM ${this.modelName} WHERE ${AccountEntity.Attributes.ID} = ?`,
            [id],
        )

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o ID "${id}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByNameWithoutPassword(name: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(
            `SELECT ${AccountEntity.AccountWithoutPasswordAttributes.join(', ')} FROM ${this.modelName} WHERE ${AccountEntity.Attributes.NAME} = ?`,
            [name],
        )

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o Nome "${name}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findByEmailWithoutPassword(email: string) {
        const accountResult = await this.database.queryOne<AccountModel.Model>(
            `SELECT ${AccountEntity.AccountWithoutPasswordAttributes.join(', ')} FROM ${this.modelName} WHERE ${AccountEntity.Attributes.EMAIL} = ?`,
            [email],
        )

        if (!accountResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Conta', message: `Conta não encontrada com o E-mail "${email}"` })
        }

        return Result.success(accountResult.getValue())
    }

    async findMany() {
        const accountsResult = await this.database.query<AccountModel.Model>(`SELECT * FROM ${this.modelName}`, [])

        if (!accountsResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Contas', message: 'Não foi possível buscar as contas' })
        }

        return Result.success(accountsResult.getValue())
    }

    async findManyWithoutPassword() {
        const accountsResult = await this.database.query<AccountModel.Model>(
            `SELECT ${AccountEntity.AccountWithoutPasswordAttributes.join(', ')} FROM ${this.modelName}`,
            [],
        )

        if (!accountsResult.isSuccess()) {
            throw new BadRequestException({ title: 'Encontrar Contas', message: 'Não foi possível buscar as contas' })
        }

        return Result.success(accountsResult.getValue())
    }
}
