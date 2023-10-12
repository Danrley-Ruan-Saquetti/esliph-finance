import 'reflect-metadata'
import { Container, injectable as Injectable, inject as Inject } from 'inversify'
import { InjectionEsliph } from '@esliph/util-node'

export class Inversion extends InjectionEsliph.Injection {
    static readonly container = new Container({ skipBaseClassChecks: true, defaultScope: 'Singleton', autoBindInjectable: false })

    private constructor() { super() }
}
