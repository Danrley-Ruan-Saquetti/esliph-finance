import { createWriteStream } from 'node:fs'
import { Service } from '@esliph/module'
import { GLOBAL_LOG_CONFIG } from '@global'

@Service({ name: 'global.service.write-stream-output' })
export class WriteStreamOutput {
    private static instance = createWriteStream(GLOBAL_LOG_CONFIG.path)
}