import { ObserverEvent } from '@esliph/util-node'
import { DatabaseController } from '../service/database/database.controller'

export class Application {
    private observer: ObserverEvent
    private database: DatabaseController

    constructor(private readonly module: new () => any) {
        this.observer = new ObserverEvent()
        this.database = new DatabaseController()

        this.initComponents()
    }

    private initComponents() {
        this.initEvents()
        this.initDatabase()
    }

    private initEvents() {
        this.observer.on('error', (err: any) => console.log(err))
    }

    private initDatabase() {
        this.database.connect()
    }
}
