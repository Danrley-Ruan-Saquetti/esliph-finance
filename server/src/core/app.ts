import { Controller } from '../common/controller'

export class Application {
    initComponents(controllers: (new () => Controller)[]) {
        controllers.map(controller => new controller().initComponents())
    }
}