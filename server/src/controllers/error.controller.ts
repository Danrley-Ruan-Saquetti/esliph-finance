import { Controller, CoreModule, Domain, Injection } from '@core'
import { LogErrorCreateUseCase } from '@modules/log/error/use-case/create.use-case'

@Controller()
export class ErrorController {
    constructor(@Injection.Inject('log-error.use-case.create') private errorCreateUC: LogErrorCreateUseCase) { }

    @CoreModule.OnEvent(`${Domain.LOCAL}/errors/create`)
    async dispatchError(data: any) {
        try {
            await this.errorCreateUC.perform(data)
        } catch (err: any) {
            return
        }
    }
}
