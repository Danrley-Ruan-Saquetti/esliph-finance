import { ObserverEsliph } from '@esliph/util-node'

export class ApplicationServer extends ObserverEsliph.ObserverServer {
    constructor(prefix = '') {
        super(prefix)
    }
}