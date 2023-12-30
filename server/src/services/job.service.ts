import { Service } from '@esliph/module'
export * from '@esliph/job'

@Service({ name: 'global.service.job' })
export class JobService {
    static onLoad() {

    }
}