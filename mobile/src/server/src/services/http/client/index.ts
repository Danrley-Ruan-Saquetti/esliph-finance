import { ObserverEsliph } from '@esliph/util-node'

export class ApplicationClient extends ObserverEsliph.ObserverClient {
    constructor(prefix = '') {
        super(prefix)
    }
}