import { Module } from '@esliph/module'
import { CategoryCreateUseCase } from '@modules/category/use-case/create.use-case'

@Module({
    providers: [CategoryCreateUseCase],
})
export class CategoryUseCaseModule { }
