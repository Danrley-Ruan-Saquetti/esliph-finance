import { Metadata } from '../metadata'

export function ClassDecorator(key: string, constructor: any, target: any) {
    return Metadata.addClass(key, constructor, target)
}
