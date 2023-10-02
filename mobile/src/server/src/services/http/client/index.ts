import { Client } from '@esliph/util-node'
import { ApplicationEvents } from '../events'

export class ApplicationClient<Context extends keyof ApplicationEvents> extends Client<ApplicationEvents, Context> {}
