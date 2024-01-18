import { Module } from '@core'
import { NotificationCreateUseCase } from '@modules/notification/use-case/create.use-case'
import { NotificationQueryUseCase } from '@modules/notification/use-case/query.use-case'

@Module({
    providers: [NotificationCreateUseCase, NotificationQueryUseCase],
})
export class NotificationUseCaseModule { }
