import { METADATA_KEY_DECORATOR } from '../metadata'
import { ClassDecorator } from './class.decorator'

export function Module() {
    return (constructor: any) => {
        ClassDecorator(METADATA_KEY_DECORATOR.MODULE, null, constructor)
    }
}
