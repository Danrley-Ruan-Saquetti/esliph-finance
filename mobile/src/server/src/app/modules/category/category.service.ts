import { Service } from '../../../common/service'
import { CategoryCreateArgs, CategoryCreateUseCase, CategoryCreateArgsHeader } from './use-case/create'
import { CategoryFindFirstArgs, CategoryFindFirstUseCase } from './use-case/query/find-first'
import { CategoryFindManyUseCase } from './use-case/query/find-many'

export class CategoryService extends Service {
    private readonly createUseCase: CategoryCreateUseCase
    private readonly queryFindOndeUseCase: CategoryFindFirstUseCase
    private readonly queryAllUseCase: CategoryFindManyUseCase

    constructor() {
        super()

        this.createUseCase = new CategoryCreateUseCase()
        this.queryFindOndeUseCase = new CategoryFindFirstUseCase()
        this.queryAllUseCase = new CategoryFindManyUseCase()
    }

    initComponents() { }

    async create(args: CategoryCreateArgs & CategoryCreateArgsHeader) {
        const response = await this.createUseCase.perform(args)

        return response
    }

    async queryById({ id, accountId }: CategoryFindFirstArgs & CategoryCreateArgsHeader) {
        const response = await this.queryFindOndeUseCase.perform({ id, accountId })

        return response
    }

    async queryByName({ name, accountId }: CategoryFindFirstArgs & CategoryCreateArgsHeader) {
        const response = await this.queryFindOndeUseCase.perform({ name, accountId })

        return response
    }

    async queryAll({ accountId }: CategoryCreateArgsHeader) {
        const response = await this.queryAllUseCase.perform({ accountId })

        return response
    }
}
