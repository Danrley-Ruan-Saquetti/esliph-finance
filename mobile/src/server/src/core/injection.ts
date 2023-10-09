import 'reflect-metadata'
import { Container, injectable as Injectable, inject as Inject } from 'inversify'

export class Inversion {
    static readonly container = new Container()
    private readonly containerLocal?: Container

    constructor(isLocal = false) {
        if (isLocal) {
            this.containerLocal = new Container()
        }
    }

    static Injectable = Injectable
    static Inject = Inject

    get container() {
        return this.containerLocal || Inversion.container
    }
}
