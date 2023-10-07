import { ExceptionEsliph } from '@esliph/util-node'

export type ExceptionModelArgs = Omit<ExceptionEsliph.ResultExceptionArgs, 'status'>