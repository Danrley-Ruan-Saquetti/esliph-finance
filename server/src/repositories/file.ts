import fs from 'node:fs'
import { join } from 'node:path'

export type File = {
    name: string,
    buffer: Buffer
}

export class FileLocalRepository {
    get basePath() { return this._basePath }

    constructor(
        private _basePath: string
    ) { }

    async upload(fileName: string, buffer: Buffer, mime?: string) {
        fileName = `${(new Date().getTime()).toString()}-${fileName}`
        const stream = fs.createWriteStream(join(this.basePath, fileName))

        const result = await new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve({ ok: true })
            })

            stream.on('error', (error) => {
                reject({ ok: false, error })
            })

            const content = buffer.toString('utf-8')

            stream.write(content)

            stream.close()
        })

        const file: File = {
            name: fileName,
            buffer
        }

        return file
    }

    async read(fileName: string) {
        const stream = fs.createReadStream(join(this.basePath, fileName))

        const chunks: Buffer[] = []

        const result = await new Promise<Buffer>((resolve, reject) => {
            stream.on('error', function (err) {
                reject(err)
            })

            stream.on('data', function (data) {
                chunks.push(data as Buffer)
            })

            stream.on('end', () => {
                const content = Buffer.concat(chunks)

                resolve(content)
            })
        })

        return result
    }
}