import { Console, ConsoleEsliph } from '@esliph/util-node'

const logLevels: ConsoleEsliph.ConsoleMethod[] = ['log', 'error', 'warn', 'info']

const TEMPLATE_LOG = '<prefix?value="#"&styles=italic>  <method?background=blue>  <dateTime>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_ERROR = '<prefix?value="#"&styles=italic>  <method?background=red>  <dateTime>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_WARN = '<prefix?value="#"&styles=italic>  <method?background=yellow&color=black>  <dateTime>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_INFO = '<prefix?value="#"&styles=italic>  <method?background=white>  <dateTime>  <context?color=green&styles=bold>: <message>'

export class LoggerService extends Console<typeof TEMPLATE_LOG, typeof TEMPLATE_ERROR, typeof TEMPLATE_WARN, typeof TEMPLATE_INFO> {
    constructor(context = '') {
        super({
            methodsValue: { context },
            levels: logLevels,
            templates: {
                log: TEMPLATE_LOG,
                error: TEMPLATE_ERROR,
                warn: TEMPLATE_WARN,
                info: TEMPLATE_INFO,
            },
        })
    }
}
