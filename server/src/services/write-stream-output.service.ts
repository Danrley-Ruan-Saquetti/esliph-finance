import { WriteStream, createWriteStream } from 'node:fs'
import { ApplicationModule, Service } from '@esliph/module'
import { GLOBAL_LOG_CONFIG } from '@global'

class WriteStreamInstance {
    instance: WriteStream

    constructor(path: string) {
        this.instance = createWriteStream(path)
    }

    write(msg: string) {
        this.instance.write(msg + '\n')
    }
}

@Service({ name: 'global.service.write-stream-output' })
export class WriteStreamOutput {
    static onLoad() {
        const writer = WriteStreamOutput.newInstance(GLOBAL_LOG_CONFIG.path)

        writer.instance.on('error', args => {
            console.log(args)
        })

        ApplicationModule.logger.on('log', msg => {
            writer.write(msg)
        })
        ApplicationModule.logger.on('error', msg => {
            writer.write(msg)
        })
        ApplicationModule.logger.on('info', msg => {
            writer.write(msg)
        })
        ApplicationModule.logger.on('warn', msg => {
            writer.write(msg)
        })
    }

    static newInstance(path: string) {
        return new WriteStreamInstance(path)
    }
}