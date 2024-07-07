import { Result } from '@esliph/common'

export type ErrorResultDatabase = {
    message: string
    causes: {
        message: string
        origin?: string
    }[]
}

export class ResultDatabase<T = any> {
    private constructor(
        protected readonly ok = true,
        protected readonly result: T | null = null,
        protected readonly error: ErrorResultDatabase | null = null
    ) { }

    static success<T = any>(result: T | null = null) {
        return new ResultDatabase<T>(true, result, null)
    }

    static error<T = any>(error: ErrorResultDatabase) {
        return new ResultDatabase<T>(false, null, error)
    }

    isSuccessFind() {
        return this.isSuccess() && this
    }

    isSuccess() {
        return this.ok
    }

    hasResult() {
        return this.result != null
    }

    getError() {
        return this.error as ErrorResultDatabase
    }

    getResult() {
        return this.result as T
    }

    getResponse() {
        return {
            isSuccess: this.ok,
            result: this.result as T,
            error: this.error as ErrorResultDatabase
        }
    }

    toResult() {
        return Result.inherit<T>({
            ok: this.ok,
            value: this.result,
            error: this.error ? { title: 'Database Operation', message: this.error.message, causes: this.error.causes } : null,
            status: this.ok ? 200 : 400
        })
    }
}