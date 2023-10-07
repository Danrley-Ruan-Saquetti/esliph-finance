import { ExceptionEsliph } from '@esliph/util-node'

export type ExceptionModelArgs = Partial<Omit<ExceptionEsliph.ResultExceptionArgs, 'status'>>