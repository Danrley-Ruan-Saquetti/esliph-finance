import axios, { AxiosDefaults, AxiosError, AxiosHeaderValue, AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, Method } from 'axios'
import { Result } from '@lib/common'

export type ApiOptions<D = any> = AxiosRequestConfig<D>

export class ApiService {
    static globalOptions: ApiOptions = { headers: { 'Content-Type': 'application/json' } }
    private api: AxiosInstance

    constructor(options: ApiOptions = {}) {
        this.api = axios.create({
            ...ApiService.globalOptions, ...options, headers: {
                ...ApiService.globalOptions.headers,
                ...options.headers
            }
        })
    }

    async get<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: ApiOptions<D>) {
        const response = await this.performRequest<T, R, D>('GET', URL, undefined, config)

        return response
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: ApiOptions<D>) {
        const response = await this.performRequest<T, R, D>('POST', URL, data, config)

        return response
    }

    async delete<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: ApiOptions<D>) {
        const response = await this.performRequest<T, R, D>('DELETE', URL, undefined, config)

        return response
    }

    async put<T = any, R = AxiosResponse<T>, D = any>(URL: string, data?: D, config?: ApiOptions<D>) {
        const response = await this.performRequest<T, R, D>('PUT', URL, data, config)

        return response
    }

    async head<T = any, R = AxiosResponse<T>, D = any>(URL: string, config?: ApiOptions<D>) {
        const response = await this.performRequest<T, R, D>('HEAD', URL, undefined, config)

        return response
    }

    async request<T = any, R = AxiosResponse<T>, D = any>(config: ApiOptions<D>) {
        try {
            const response = await this.api.request<T, R, D>({ ...ApiService.globalOptions, ...config })

            return Result.success<AxiosResponse<T, any>>(response as any)
        } catch (err: any) {
            return Result.failure<AxiosResponse<T, any>>({ ...err })
        }
    }

    private async performRequest<T = any, R = AxiosResponse<T>, D = any>(method: Method, url: string, data?: D, config?: ApiOptions<D>) {
        const options = {
            ...ApiService.globalOptions,
            ...this.api.defaults as any,
            ...config
        }

        try {
            const response = await this.api.request<T, R, D>({
                method,
                url,
                data,
                ...options
            }) as any

            return Result.success<T>(response.data.value, response.data.status)
        } catch (err: any) {
            if (err instanceof AxiosError) {
                return Result.failure<T>({ ...err, ...err.response?.data, ...err, ...err.response?.data?.error }, err.response?.data?.status)
            }

            return Result.failure<T>({ ...err })
        }
    }

    getUri(config?: ApiOptions) {
        const response = this.api.getUri(config)

        return response
    }

    setOptions(config: Partial<Omit<AxiosDefaults<any>, 'headers'> & { headers: HeadersDefaults & { [key: string]: AxiosHeaderValue } }>) {
        this.api.defaults = {
            ...ApiService.globalOptions,
            ...this.api.defaults,
            ...config
        }
    }
}