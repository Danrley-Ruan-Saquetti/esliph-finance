import { getEnv } from '@esliph/util-node'
import { ENV } from './core'
import Bootstrap from './core/bootstrap'

const env = getEnv({ name: 'ENV', defaultValue: ENV.Development }) as ENV

Bootstrap(env)