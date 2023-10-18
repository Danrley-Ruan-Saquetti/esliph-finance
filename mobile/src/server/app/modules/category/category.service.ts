import { Service } from '../../../common/service'
import { CategoryCreateArgs, CategoryCreateUseCase, CategoryCreateArgsHeader } from './use-case/create'
import { CategoryFindFirstArgs, CategoryFindFirstUseCase } from './use-case/query/find-first'
import { CategoryFindManyUseCase } from './use-case/query/find-many'
import { CategoryUpdateArgs, CategoryUpdateArgsHeader, CategoryUpdateUseCase } from './use-case/update'

export class CategoryService extends Service {
    private readonly createUseCase: CategoryCreateUseCase
    private readonly updateUseCase: CategoryUpdateUseCase
    private readonly queryFindOndeUseCase: CategoryFindFirstUseCase
    private readonly queryAllUseCase: CategoryFindManyUseCase

    constructor() {
        super()

        this.createUseCase = new CategoryCreateUseCase()
        this.updateUseCase = new CategoryUpdateUseCase()
        this.queryFindOndeUseCase = new CategoryFindFirstUseCase()
        this.queryAllUseCase = new CategoryFindManyUseCase()
    }

    async create(args: CategoryCreateArgs & CategoryCreateArgsHeader) {
        const response = await this.createUseCase.perform(args)

        return response
    }

    async update(args: CategoryUpdateArgs & CategoryUpdateArgsHeader) {
        const response = await this.updateUseCase.perform(args)

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
