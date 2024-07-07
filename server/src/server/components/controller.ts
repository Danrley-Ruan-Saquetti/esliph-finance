import { DecoratorMetadata, Metadata } from '@esliph/metadata'
import { ClassConstructor } from '@util/types'

const METADATA_KEY_CONTROLLER = 'metadata.controller'

export type ControllerConfig = {
    prefix: string
}

export type ControllerConfigArgs = Partial<ControllerConfig>

export function Controller(config: ControllerConfigArgs = {}) {
    return DecoratorMetadata.Create.Class({ key: METADATA_KEY_CONTROLLER, value: { ...config } })
}

// Metadata
export function isControllerMetadata(constructor: ClassConstructor) {
    return !!getControllerMetadata(constructor)
}

export function getControllerMetadata(constructor: ClassConstructor) {
    return Metadata.Get.Class<ControllerConfig>(METADATA_KEY_CONTROLLER, constructor)
}