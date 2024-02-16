import { Module } from '@core'
import { CategoryCustomerController } from '@modules/category/category.customer.controller'
import { CategoryAdminController } from '@modules/category/category.admin.controller'
import { CategoryRepository } from '@modules/category/category.repository'
import { CategoryUseCaseModule } from '@modules/category/use-case/use-case.module'

@Module({
    imports: [CategoryUseCaseModule],
    controllers: [CategoryCustomerController, CategoryAdminController],
    providers: [CategoryRepository],
})
export class CategoryModule { }
