import AsyncStorage from '@react-native-async-storage/async-storage'
import { Result } from '@lib/common'

export class StorageService {
    async update(key: string, value: any) {
        try {
            await AsyncStorage.mergeItem(key, JSON.stringify(value))

            return Result.success({ message: `Item "${key}" successfully updated` })
        } catch (err: any) {
            return Result.failureOperational({ title: `Update value in "${key}" item`, ...err })
        }
    }

    async set<T = any>(key: string, value: T) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))

            return Result.success<{ message: string }>({ message: `Item "${key}" successfully saved` })
        } catch (err: any) {
            return Result.failureOperational<{ message: string }>({ title: `Save value in "${key}" item`, ...err })
        }
    }

    async get<T = any>(key: string) {
        try {
            const result = await AsyncStorage.getItem(key) as any

            if (result == null) {
                return Result.failure<T>({ title: `Get value in "${key}" item`, message: 'Value not fount' })
            }

            return Result.success<T>(JSON.parse(result))
        } catch (err: any) {
            return Result.failureOperational<T>({ title: `Get value in "${key}" item`, ...err })
        }
    }

    async getAllKeys() {
        try {
            const keys = await AsyncStorage.getAllKeys()

            return Result.success(keys)
        } catch (err: any) {
            return Result.failure<string[]>({ title: 'Get all keys', ...err })
        }
    }

    async delete(key: string) {
        try {
            await AsyncStorage.removeItem(key)

            return Result.success({ message: `Item "${key}" successfully removed` })
        } catch (err: any) {
            return Result.failureOperational({ title: `Remove value in "${key}" item`, ...err })
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear()

            return Result.success({ message: 'Storage successfully cleaned' })
        } catch (err: any) {
            return Result.failureOperational({ title: 'Clear storage', ...err })
        }
    }

    static useStorage<T = any>(key: string) {
        const storage = new StorageService()

        return {
            update: async (value: T) => {
                const result = await storage.update(key, value)

                return result
            },
            set: async (value: T) => {
                const result = await storage.set(key, value)

                return result
            },
            get: async () => {
                const result = await storage.get<T>(key)

                return result
            },
            delete: async () => {
                const result = await storage.delete(key)

                return result
            },
        }
    }
}

export const storageService = new StorageService()