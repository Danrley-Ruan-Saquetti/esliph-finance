import { Module } from '@core'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'
import { CategoryQueryUseCase } from '@modules/category/use-case/query.use-case'
import { CategoryUpdateUseCase } from '@modules/category/use-case/update.use-case'

@Module({
    providers: [CategoryCreateUseCase, CategoryQueryUseCase, CategoryUpdateUseCase],
})
export class CategoryUseCaseModule { }
