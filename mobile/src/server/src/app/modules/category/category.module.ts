import { Module } from '../../../common/module'
import { CategoryController } from './category.controller'
import { CategoryRepository } from './category.repository'
import { CategoryService } from './category.service'

export class CategoryModule extends Module {
    constructor() {
        super({ imports: [], controllers: [CategoryController, CategoryRepository], services: [CategoryService] })
    }
}
