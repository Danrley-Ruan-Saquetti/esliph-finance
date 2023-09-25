import 'reflect-metadata'
import { METADATA_KEY_TYPE } from './constants'

function getFullKey(...keys: string[]) {
    return keys.join(':')
}

export class Metadata {
    static addClass(key: string, metadata: any, target: Function) {
        Reflect.defineMetadata(getFullKey(METADATA_KEY_TYPE.CLASS, key), metadata, target)
    }

    static getClass<T = any>(key: string, metadata: any) {
        return Reflect.getMetadata(getFullKey(METADATA_KEY_TYPE.CLASS, key), metadata) as T
    }
}
