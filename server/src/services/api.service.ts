import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import axios, { AxiosDefaults, AxiosHeaderValue, AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults } from 'axios'

@Service({ name: 'global.service.api' })
export class ApiService {
    private api: AxiosInstance

    constructor() {
        this.api = axios.create()
    }

    setOptions(config: Partial<Omit<AxiosDefaults<any>, 'headers'> & { headers: HeadersDefaults & { [key: string]: AxiosHeaderValue } }>) {
        console.log(this.api.defaults)
        this.api.defaults = {
            ...this.api.defaults,
            ...config
        }
        console.log(this.api.defaults)
    }

    async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.get<T, R, D>(url, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.post<T, R, D>(url, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.delete<T, R, D>(url, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.put<T, R, D>(url, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    getUri(config?: AxiosRequestConfig) {
        const response = this.api.getUri(config)

        return response
    }

    async request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.request<T, R, D>(config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.head<T, R, D>(url, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.postForm<T, R, D>(url, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.putForm<T, R, D>(url, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }

    async patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.patchForm<T, R, D>(url, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure({ title: 'Request API', ...err })
        }
    }
}