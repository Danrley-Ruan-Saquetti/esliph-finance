import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import axios, { AxiosDefaults, AxiosHeaderValue, AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, HttpStatusCode, Method } from 'axios'

@Service({ name: 'global.service.api' })
export class ApiService {
    private api: AxiosInstance

    constructor() {
        this.api = axios.create({})
    }

    async get<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: AxiosRequestConfig<D>) {
        const response = await this.performRequest<T, R, D>('GET', URL, undefined, config)

        return response
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.performRequest<T, R, D>('POST', URL, data, config)

        return response
    }

    async delete<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: AxiosRequestConfig<D>) {
        const response = await this.performRequest<T, R, D>('DELETE', URL, undefined, config)

        return response
    }

    async put<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: AxiosRequestConfig<D>) {
        const response = await this.performRequest<T, R, D>('PUT', URL, data, config)

        return response
    }

    async head<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: AxiosRequestConfig<D>) {
        const response = await this.performRequest<T, R, D>('HEAD', URL, undefined, config)

        return response
    }

    async request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.request<T, R, D>(config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, any>>({ title: 'Request API', ...err })
        }
    }

    async postForm<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.postForm<T, R, D>(URL, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, any>>({ title: 'Request API', ...err })
        }
    }

    async putForm<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.putForm<T, R, D>(URL, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, any>>({ title: 'Request API', ...err })
        }
    }

    async patchForm<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.patchForm<T, R, D>(URL, data, config)

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, any>>({ title: 'Request API', ...err })
        }
    }

    private async performRequest<T = any, R = AxiosResponse<T>, D = any>(method: Method, url: string, data?: D, config?: AxiosRequestConfig<D>) {
        try {
            const response = await this.api.request<T, R, D>({
                method,
                url,
                data,
                ...this.api.defaults as any,
                ...config
            })

            return Result.success<AxiosResponse<T, D>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, D>>({ title: 'Request API', ...err })
        }
    }

    getUri(config?: AxiosRequestConfig) {
        const response = this.api.getUri(config)

        return response
    }

    setOptions(config: Partial<Omit<AxiosDefaults<any>, 'headers'> & { headers: HeadersDefaults & { [key: string]: AxiosHeaderValue } }>) {
        this.api.defaults = {
            ...this.api.defaults,
            ...config
        }
    }
}