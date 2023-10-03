import { Service } from '../../common/service'
import { ListenerRepositoryServer } from '../http'

class Database implements Service {
    private readonly observer: ListenerRepositoryServer

    constructor() {
        this.observer = new ListenerRepositoryServer()

        this.initComponents()
    }

    initComponents() {
        return this
    }
}

export const database = new Database().initComponents()
