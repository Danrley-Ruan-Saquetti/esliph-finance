import { AppModule } from '../app/app.module'
import { Controller } from '../common/controller'

export class Application {
    constructor(private appModule: new () => AppModule) { }

    initComponents() {
        new this.appModule().getController().map(controller => this.initController(controller))
    }

    useController(...controller: (new () => Controller)[]) {
        controller.map(controller => this.initController(controller))
    }

    private initController(controller: new () => Controller) {
        new controller().initComponents()
    }
}