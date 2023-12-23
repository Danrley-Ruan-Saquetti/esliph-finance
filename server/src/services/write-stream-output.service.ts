import { WriteStream, createWriteStream } from 'node:fs'
import { ApplicationModule, Service } from '@esliph/module'
import { GLOBAL_LOG_CONFIG } from '@global'

class WriteStreamInstance {
    private instance: WriteStream
    private isOpen = false

    constructor(path: string) {
        try {
            this.instance = createWriteStream(path)
            this.isOpen = true
        } catch (err: any) {
            this.isOpen = false
        }
    }

    write(msg: string) {
        if (!GLOBAL_LOG_CONFIG.enableLog || !this.isOpen) { return }

        try {
            this.instance.write(msg + '\n')
        } catch (err: any) {
            this.isOpen = false
        }
    }
}

@Service({ name: 'global.service.write-stream-output' })
export class WriteStreamOutput {
    static onLoad() {
        const writer = WriteStreamOutput.newInstance(`${GLOBAL_LOG_CONFIG.path}/app.log`)

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