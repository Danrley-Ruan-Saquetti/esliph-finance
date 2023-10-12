// import { HttpEsliph } from '@esliph/util-node'
// import { LoggerService } from '../services/logger'
import { Module } from '../common/module'
// import { ListenerPublicClient } from '../services/http'

export enum ENV {
    Production = 'Production',
    Development = 'Development',
    Test = 'Test',
}

export class Application {
    private module: Module
    // private logger: LoggerService

    constructor(
        module: new (...args: any[]) => Module = Module,
        private readonly env = ENV.Production,
    ) {
        this.module = new module()
        // this.logger = new LoggerService('[Server]')
    }

    // initComponents() {
    //     this.log('LOG', 'Initialization components...')

    //     this.module.initComponents()
    //     this.initEvents()

    //     this.log('LOG', 'Server started')
    // }

    // private initEvents() {
    //     ListenerPublicClient.on<HttpEsliph.EventsRouter, 'request/error'>('request/error', args => {
    //         this.log('ERROR', args, args.request.context ? `[${args.request.context}]` : '')
    //     })
    //     ListenerPublicClient.on<HttpEsliph.EventsRouter, 'request/end'>('request/end', args => {
    //         this.log(
    //             args.response.isSuccess() ? 'LOG' : 'ERROR',
    //             `${args.request.origin ? args.request.origin + ' - ' : ''}${args.request.access}:${args.request.method} "${args.request.name
    //             }" ${args.response.getStatus()}`,
    //             args.request.context ? `[${args.request.context}]` : '',
    //         )
    //     })
    // }

    // private log(method: 'ERROR' | 'LOG', message: any, context = '[Server]') {
    //     if (this.env == ENV.Test) {
    //         return
    //     }

    //     this.logger[method == 'ERROR' ? 'error' : 'log'](message, null, { context: ` ${context}` })
    // }
}
