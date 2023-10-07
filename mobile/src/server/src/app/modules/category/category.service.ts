import { Service } from '../../../common/service'
import { CategoryCreateArgs, CategoryCreateUseCase } from './use-case/create'

export class CategoryService extends Service {
    private readonly createUseCase: CategoryCreateUseCase

    constructor() {
        super()

        this.createUseCase = new CategoryCreateUseCase()
    }

    initComponents() { }

    async create(args: CategoryCreateArgs) {
        const response = await this.createUseCase.perform(args)

        return response
    }
}
