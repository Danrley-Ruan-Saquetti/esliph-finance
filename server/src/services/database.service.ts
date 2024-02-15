export * from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { Injection, Service, Result } from '@core'
import { GLOBAL_FORMATTER_CONFIG, GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
import { EmitterEventService } from '@services/emitter-event.service'

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

    static onLoad() {
        const writer = WriteStreamOutputService.newInstance(`${GLOBAL_LOG_CONFIG.path}/db.log`)
        const emitter = Injection.resolve(EmitterEventService)

        this.instance.$on('error', async args => {
            await emitter.emit('/local/errors/create', {
                ...Result.failure({
                    title: 'Database Exception',
                    ...args,
                }).getError(),
                origin: 'Database'
            })

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
        try {
            await this.instance.$connect()
        } catch (err: any) {
            console.error(err)
            process.exit(1)
        }
    }

    get instance() {
        return DatabaseService.instance
    }
}
