import { Module } from '@core'
import { CategoryClientController } from '@modules/category/category.client.controller'
import { CategoryAdminController } from '@modules/category/category.admin.controller'
import { CategoryRepository } from '@modules/category/category.repository'
import { CategoryUseCaseModule } from '@modules/category/use-case/use-case.module'

@Module({
    imports: [CategoryUseCaseModule],
    controllers: [CategoryClientController, CategoryAdminController],
    providers: [CategoryRepository],
})
export class CategoryModule { }
