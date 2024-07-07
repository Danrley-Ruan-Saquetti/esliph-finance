import { FilterRouter } from '@server/components/filter'
import { Decorator } from '@esliph/decorator'
import { DecoratorMetadata, Metadata } from '@esliph/metadata'
import type { ClassConstructor } from '@util/types'

const METADATA_KEY_GUARD = 'metadata.guard'

export type GuardConfig = {
    filters: ClassConstructor<FilterRouter>[]
}

export function Guard(filter: ClassConstructor<FilterRouter>) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        const { filters = [] } = getGuardMetadata(target.constructor, key) || {}

        filters.push(filter)

        Metadata.Create.Method({ key: METADATA_KEY_GUARD, value: { filters } }, target, key)
    }

    return Decorator.Create.Method(handler)
}

// Metadata
export function isGuardMetadata(constructor: ClassConstructor, keyProperty: string) {
    return !!getGuardMetadata(constructor, keyProperty)
}

export function getGuardMetadata(constructor: ClassConstructor, keyProperty: string) {
    return Metadata.Get.Method<GuardConfig>(METADATA_KEY_GUARD, constructor, keyProperty)
}