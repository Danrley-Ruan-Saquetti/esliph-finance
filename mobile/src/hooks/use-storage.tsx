import { useEffect, useState } from 'react'
import { StorageService } from '@services/storage.service'
import { Result } from '@lib/common'

export function useStorage<T = any>(key: string, valueInitial: T | null = null) {
    const storage = StorageService.useStorage(key)
    const [valueState, setValueState] = useState<T>(valueInitial as any)
    const [isLoading, setIsLoading] = useState(false)

    const setItem = async (value: T): Promise<Result<{ message: string }>> => {
        const result = await storage.set(value)

        if (result.isSuccess()) {
            setValueState(value)
        }

        return result
    }

    const remove = async () => {
        const result = await storage.delete()

        if (result.isSuccess()) {
            setValueState(null as any)
        }

        return result
    }

    const updateInitial = async () => {
        const result = await storage.get()

        if (result.isSuccess()) {
            setValueState(result.getValue())
        }

        setIsLoading(true)
    }

    useEffect(() => {
        updateInitial()
    }, [])

    return { isLoading, valueState, setItem, remove } as const
}