export * from '@prisma/client'
import { PrismaCustomer } from '@prisma/client'
import { Service } from '@esliph/module'
import { GLOBAL_FORMATTER_CONFIG, GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutput } from '@services/write-stream-output.service'

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static instance = new PrismaCustomer({
        log: [
            { level: 'error', emit: 'event' },
            { level: 'info', emit: 'event' },
            { level: 'query', emit: 'event' },
            { level: 'warn', emit: 'event' },
        ]
    })

    static onLoad() {
        const writer = WriteStreamOutput.newInstance(`${GLOBAL_LOG_CONFIG.path}/db.log`)

        this.instance.$on('error', args => {
            writer.write(`#  ${GLOBAL_FORMATTER_CONFIG.date.format()}  [ERROR]: ${args.message}`)
        })
        this.instance.$on('info', args => {
            writer.write(`#  ${GLOBAL_FORMATTER_CONFIG.date.format()}  [INFO]: ${args.message}`)
        })
        this.instance.$on('query', args => {
            writer.write(`#  ${GLOBAL_FORMATTER_CONFIG.date.format()}  [QUERY]: ${args.query} ${args.params}`)
        })
        this.instance.$on('warn', args => {
            writer.write(`#  ${GLOBAL_FORMATTER_CONFIG.date.format()}  [WARN]: ${args.message}`)
        })
    }

    static async onStart() {
        await this.instance.$connect()
    }

    get instance() {
        return DatabaseService.instance
    }
}
