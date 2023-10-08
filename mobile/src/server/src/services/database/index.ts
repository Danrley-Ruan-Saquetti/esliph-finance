import { Service } from '../../common/service'
import { ListenerRepositoryServer } from '../http'

class Database implements Service {
    private readonly listener: ListenerRepositoryServer

    constructor() {
        this.listener = new ListenerRepositoryServer()

        this.initComponents()
    }

    initComponents() {
        return this
    }
}

export const database = new Database().initComponents()
