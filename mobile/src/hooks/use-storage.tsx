import { useEffect, useState } from 'react'
import { StorageService } from '@services/storage.service'
import { Result } from '@lib/common'

export function useStorage<T = any>(key: string, valueInitial?: T) {
    const storage = StorageService.useStorage(key)
    const [valueState, setValueState] = useState<T>(valueInitial as any)

    const setItem = async (value: T): Promise<Result<T>> => {
        const result = await storage.set(value)

        if (result.isSuccess()) {
            setValueState(value)
        }

        return result
    }

    const updateInitial = async () => {
        const result = await storage.get()

        console.log(result)

        if (result.isSuccess()) {
            setValueState(result.getValue())
        }
    }

    useEffect(() => {
        updateInitial()
    }, [])

    console.log(valueState)

    return [valueState, setItem] as const
}