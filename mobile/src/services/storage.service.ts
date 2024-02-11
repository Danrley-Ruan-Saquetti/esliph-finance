import AsyncStorage from '@react-native-async-storage/async-storage'
import { Result } from '../lib/common'

export class StorageService {
    async update(key: string, value: any) {
        try {
            await AsyncStorage.mergeItem(key, JSON.stringify(value))

            return Result.success({ message: `Item "${key}" successfully updated` })
        } catch (err: any) {
            return Result.failure({ title: `Update value in "${key}" item`, ...err })
        }
    }

    async set(key: string, value: any) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))

            return Result.success({ message: `Item "${key}" successfully saved` })
        } catch (err: any) {
            return Result.failure({ title: `Save value in "${key}" item`, ...err })
        }
    }

    async get<T = any>(key: string) {
        try {
            const result = await AsyncStorage.getItem(key) as any

            return Result.success<T>(JSON.parse(result))
        } catch (err: any) {
            return Result.failure<T>({ title: `Save value in "${key}" item`, ...err })
        }
    }

    async delete(key: string) {
        try {
            await AsyncStorage.removeItem(key)

            return Result.success({ message: `Item "${key}" successfully removed` })
        } catch (err: any) {
            return Result.failure({ title: `Remove value in "${key}" item`, ...err })
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear()

            return Result.success({ message: 'Storage successfully cleaned' })
        } catch (err: any) {
            return Result.failure({ title: 'Clear storage', ...err })
        }
    }
}

export const storageService = new StorageService()