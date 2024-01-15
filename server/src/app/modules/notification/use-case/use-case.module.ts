import { Module } from '@esliph/module'
import { NotificationCreateUseCase } from '@modules/notification/use-case/create.use-case'
import { NotificationQueryUseCase } from '@modules/notification/use-case/query.use-case'

@Module({
    providers: [NotificationCreateUseCase, NotificationQueryUseCase],
})
export class NotificationUseCaseModule { }
