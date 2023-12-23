export * from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { ApplicationModule, Service } from '@esliph/module'
import { GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutput } from '@services/write-stream-output.service'

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static instance = new PrismaClient({
        log: [
            { level: 'error', emit: 'event' },
            { level: 'info', emit: 'event' },
            { level: 'query', emit: 'event' },
            { level: 'warn', emit: 'event' },
        ]
    })

    static async onLoad() {
        const writer = WriteStreamOutput.newInstance(GLOBAL_LOG_CONFIG.dbPath)

        this.instance.$on('error', args => {
            writer.write(`${new Date(Date.now())}  "${args.message}"`)
        })
        this.instance.$on('info', args => {
            writer.write(`${new Date(Date.now())}  "${args.message}"`)
        })
        this.instance.$on('query', args => {
            writer.write(`${new Date(Date.now())}  "${args.query}"`)
        })
        this.instance.$on('warn', args => {
            writer.write(`${new Date(Date.now())}  "${args.message}"`)
        })

        await this.instance.$connect()
    }

    get instance() {
        return DatabaseService.instance
    }
}
