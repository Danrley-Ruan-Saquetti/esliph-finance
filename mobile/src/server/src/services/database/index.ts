import { ApplicationServer } from '../http'

class Database {
    private readonly observer: ApplicationServer

    constructor() {
        this.observer = new ApplicationServer('@db:')

        this.initComponents()
    }

    private initComponents() {
        this.observer.get('users', (req, res) => {
            console.log(req)
            return []
        })
    }
}

export const database = new Database()