import { Application } from './application'

export class Factory {
    private static app: Application

    static createFactory(module: new () => any) {
        this.app = new Application(module)

        return this.app
    }
}
