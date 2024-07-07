import { DecoratorMetadata, Metadata } from '@esliph/metadata'
import { ClassConstructor } from '@util/types'

const METADATA_KEY_MODULE = 'metadata.module'

export type Provider = (ClassConstructor | { prefix?: string })

export type ModuleConfig = {
    imports: ClassConstructor[]
    controllers: ClassConstructor[]
    providers: Provider[]
}

export function Module({ imports = [], controllers = [], providers = [] }: Partial<ModuleConfig> = {}) {
    return DecoratorMetadata.Create.Class({ key: METADATA_KEY_MODULE, value: { imports, controllers, providers } })
}

export function isModuleMetadata(constructor: ClassConstructor) {
    return !!getModuleMetadata(constructor)
}

export function getModuleMetadata(constructor: ClassConstructor) {
    return Metadata.Get.Class<ModuleConfig>(METADATA_KEY_MODULE, constructor)
}