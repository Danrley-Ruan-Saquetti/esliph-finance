import 'reflect-metadata'
import { Container, injectable as Injectable, inject as Inject } from 'inversify'

export class Inversion {
    static readonly container = new Container({ skipBaseClassChecks: true, defaultScope: 'Singleton', autoBindInjectable: false })

    private constructor() { }

    static Injectable = Injectable
    static Inject = Inject
}
