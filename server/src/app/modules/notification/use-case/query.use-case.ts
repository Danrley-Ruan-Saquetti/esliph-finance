import { Injection } from '@core'
import { Service } from '@core'
import { Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { NotificationRepository } from '@modules/notification/notification.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'notification.use-case.query' })
export class NotificationQueryUseCase extends UseCase {
    constructor(@Injection.Inject('notification.repository') private notificationRepository: NotificationRepository) {
        super()
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const notificationResult = await this.notificationRepository.findUnique({ where: { id } })

        if (!notificationResult.isSuccess()) {
            return Result.failure({ ...notificationResult.getError(), title: 'Query Notification' })
        }

        return Result.success(notificationResult.getValue())
    }

    async queryMany() {
        const notificationsResult = await this.notificationRepository.findMany({})

        if (!notificationsResult.isSuccess()) {
            return Result.failure({ ...notificationsResult.getError(), title: 'Query Notifications' })
        }

        return Result.success(notificationsResult.getValue() || [])
    }
}
