import bcrypt from 'bcrypt'

export class Hash {
    static hash(value: string) {
        return bcrypt.hashSync(value, 5)
    }
    static async compare(hash: string, value: string) {
        return await bcrypt.compare(hash, value)
    }
}