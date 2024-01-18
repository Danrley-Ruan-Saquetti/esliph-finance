import { Module } from '@core'
import { CategoryController } from '@modules/category/category.controller'
import { CategoryRepository } from '@modules/category/category.repository'
import { CategoryUseCaseModule } from '@modules/category/use-case/use-case.module'

@Module({
    imports: [CategoryUseCaseModule],
    controllers: [CategoryController],
    providers: [CategoryRepository],
})
export class CategoryModule { }
