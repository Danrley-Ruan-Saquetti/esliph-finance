import { useEffect, useState } from 'react'
import { StorageService } from '@services/storage.service'

export function useStorage(key: string, valueInitial: any = null) {
    const storage = StorageService.useStorage(key)
    const [valueState, setValueState] = useState(valueInitial)

    const setItem = async (value: any) => {
        const result = await storage.set(value)

        if (result.isSuccess()) {
            setValueState(value)
        }

        return result
    }

    const updateInitial = async () => {
        const result = await storage.get()

        if (result.isSuccess()) {
            setValueState(result.getValue())
        }
    }

    useEffect(() => {
        updateInitial()
    }, [])

    return [valueState, setItem]
}