import { Server } from '@esliph/util-node'
import { ApplicationEvents } from '../events'

export class ApplicationServer<Context extends keyof ApplicationEvents> extends Server<ApplicationEvents, Context> {}
