import { DecoratorMetadata, Metadata } from '@esliph/metadata'
import { RouterMethod } from '@enums/http'
import { ClassConstructor } from '@util/types'
import { getPropertiesMethodsFromClass } from '@util/geral'
import { isControllerMetadata } from '@server/components/controller'

const METADATA_REQUEST = 'metadata.router'

export type RouterConfig = {
    path: string
    method: RouterMethod
}

export type RouterConfigArgs = Omit<RouterConfig, 'method' | 'path'>

export function Get(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.GET })
}

export function Post(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.POST })
}

export function Put(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.PUT })
}

export function Patch(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.PATCH })
}

export function Delete(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.DELETE })
}

export function Head(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.HEAD })
}

export function Options(path = '', config?: RouterConfigArgs) {
    return createRouterMetadata({ ...config, path, method: RouterMethod.OPTIONS })
}

// Metadata
function createRouterMetadata(config: RouterConfig) {
    return DecoratorMetadata.Create.Method({ key: METADATA_REQUEST, value: config })
}

export function getRoutersFromController(constructor: ClassConstructor) {
    if (!isControllerMetadata(constructor))
        return []

    const methodsController = getPropertiesMethodsFromClass(constructor)

    const routers = methodsController.map(methodName => {
        const config = getRouterByController(constructor, methodName)

        return config ? { ...config, methodName } : null
    }).filter(routers => !!routers) as {
        methodName: string
        path: string
        method: RouterMethod
    }[]

    return routers
}

export function isRouterMetadata(constructor: ClassConstructor, keyProperty: string) {
    return !!getRouterByController(constructor, keyProperty)
}

export function getRouterByController(constructor: ClassConstructor, keyProperty: string) {
    return Metadata.Get.Method<RouterConfig>(METADATA_REQUEST, constructor, keyProperty)
}