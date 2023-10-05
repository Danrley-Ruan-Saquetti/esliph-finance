import { Console, ConsoleEsliph } from '@esliph/util-node'

const logLevels: ConsoleEsliph.ConsoleMethod[] = ['log', 'error', 'warn', 'info']

const TEMPLATE_LOG = '<prefix?value="#"&styles=italic> [<pidName?value="PortalFinance"&color=green&styles=italic;bold>]  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_ERROR = '<prefix?value="#"&styles=italic> [<pidName?value="PortalFinance"&color=green&styles=italic;bold>]  <dateTime>  <method?background=red>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_WARN = '<prefix?value="#"&styles=italic> [<pidName?value="PortalFinance"&color=green&styles=italic;bold>]  <dateTime>  <method?background=yellow&color=black>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_INFO = '<prefix?value="#"&styles=italic> [<pidName?value="PortalFinance"&color=green&styles=italic;bold>]  <dateTime>  <method?background=white>  <context?color=green&styles=bold>: <message>'

export class LoggerService extends Console<typeof TEMPLATE_LOG, typeof TEMPLATE_ERROR, typeof TEMPLATE_WARN, typeof TEMPLATE_INFO> {
    constructor(context = '') {
        super({ methodsValue: { context }, levels: logLevels })
    }
}