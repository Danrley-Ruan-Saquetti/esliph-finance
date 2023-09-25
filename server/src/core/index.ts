import { Application } from './application'

export class Factory {
    private static app: Application

    static createFactory(module: new () => any) {
        return new Application(module)
    }
}
