import { Prisma, PrismaClient } from '@prisma/client'
import { ResultDatabase } from '@common/result-database'
import { DatabaseException } from '@exceptions/database'

const prismaApp = new PrismaClient({
    log: [
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'event' },
    ]
})

prismaApp.$on('error', async args => {
    console.log(`${new Date(args.timestamp).toLocaleString()}\t${args.message.trim().replace(/\n{2,}/g, '\n').replace(/(^\\n+)|(\\n+$)/g, '')}\nTarget: ${args.target}`)
})

prismaApp.$on('query', async args => {
    // console.log(args.query, args.params)
})

export class Database {
    static instance = new Database()

    get instance() { return prismaApp }

    async query<T = any>(query: TemplateStringsArray, ...values: any[]) {
        try {
            return await this.instance.$queryRaw<T>(query, ...values)
        } catch (err) {
            throw new DatabaseException(this.getError(err).getResponse().error)
        }
    }

    async exec(query: TemplateStringsArray, ...values: any[]) {
        try {
            return await this.instance.$executeRaw(query, ...values)
        } catch (err) {
            throw new DatabaseException(this.getError(err).getResponse().error)
        }
    }

    async queryUnsafe<T = any>(query: string, ...values: any[]) {
        try {
            return await this.instance.$queryRawUnsafe<T>(query, ...values)
        } catch (err) {
            throw new DatabaseException(this.getError(err).getResponse().error)
        }
    }

    async execUnsafe(query: string, ...values: any[]) {
        try {
            return await this.instance.$executeRawUnsafe(query, ...values)
        } catch (err) {
            throw new DatabaseException(this.getError(err).getResponse().error)
        }
    }

    getResponse<T = any>(res: T | null) {
        return ResultDatabase.success<T>(res as T)
    }

    getError<T = any>(err: any) {
        return ResultDatabase.error<T>(Database.getError(err))
    }

    static async init() {
        await Database.connect()
    }

    static async connect() {
        try {
            await prismaApp.$connect()
        } catch (err: any) {
            console.log(Database.getError(err))
            await prismaApp.$disconnect()
            process.exit(1)
        }
    }

    static getError(err: any) {
        let title = 'Database Error'
        let message = err.message || 'Error'
        let errorCode = (err as any).errorCode || (err as any).code || 'P0000'
        let causes = []

        switch (err.constructor) {
            case Prisma.PrismaClientInitializationError:
                title = 'Initialization Error'
                break
            case Prisma.PrismaClientKnownRequestError:
                title = 'Known Request Error'
                causes = (err.meta || {}).target as [] || []
                break
            case Prisma.PrismaClientRustPanicError:
                title = 'Rust Panic Error'
                break
            case Prisma.PrismaClientUnknownRequestError:
                title = 'Unknown Error'
                break
            case Prisma.PrismaClientValidationError:
                title = 'Validation Error'
                break
        }

        return { message: `${title}: ${message.trim().replace(/\n{2,}/g, '\n').replace(/(^\\n+)|(\\n+$)/g, '')}`, causes, errorCode }
    }
}

export class Transaction {
    private activeTransaction = false

    static async begin() {
        const transaction = new Transaction()
        await transaction.begin()

        return transaction
    }

    async begin() {
        if (this.activeTransaction)
            throw 'Transaction is already active'

        try {
            await Database.instance.execUnsafe('BEGIN')
        } catch (_) { }
        finally {
            this.activeTransaction = true
        }
    }

    async save() {
        if (!this.activeTransaction)
            throw 'Transaction not active'

        return await TransactionSavePoint.save()
    }

    async finish(isSuccess = true) {
        if (isSuccess)
            return await this.commit()
        else
            return await this.rollback()
    }

    async commit() {
        if (!this.activeTransaction)
            throw 'Transaction not active'

        try {
            await Database.instance.execUnsafe('COMMIT')
        } catch (_) { }
        finally {
            this.clear()
        }
    }

    async rollback() {
        if (!this.activeTransaction)
            throw 'Transaction not active'

        try {
            await Database.instance.execUnsafe('ROLLBACK')
        } catch (_) { }
        finally {
            this.clear()
        }
    }

    private clear() {
        this.activeTransaction = true
    }
}

class TransactionSavePoint {
    private activeSavePoint = false
    private name = `${new Date(Date.now()).getTime()}${Math.round(Math.random() * 100)}`

    static async save() {
        const point = new TransactionSavePoint()
        await point.save()

        return point
    }

    async save() {
        if (this.activeSavePoint)
            throw 'Save point is already active'

        try {
            await Database.instance.execUnsafe('SAVEPOINT ' + '"' + this.name + '"')
        } catch (_) { }
        finally {
            this.activeSavePoint = true
        }
    }

    async release() {
        if (!this.activeSavePoint)
            throw 'Save point not active'

        try {
            await Database.instance.execUnsafe('RELEASE SAVEPOINT ' + '"' + this.name + '"')
        } catch (_) { }
        finally {
            this.activeSavePoint = false
        }
    }

    async rollback() {
        if (!this.activeSavePoint)
            throw 'Save point not active'

        try {
            await Database.instance.execUnsafe('ROLLBACK TO SAVEPOINT ' + '"' + this.name + '"')
        } catch (_) { }
        finally {
            this.activeSavePoint = false
        }
    }
}