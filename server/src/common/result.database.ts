import { ErrorResult, ErrorResultInfo, Result, ResultModel } from '@esliph/common'

export class ResultDatabase<ResultValueModel = any> extends Result<ResultValueModel> {
    protected hasErrorInOperation: boolean

    constructor(resultModel: ResultModel<ResultValueModel> & { hasErrorInOperation: boolean }) {
        super(resultModel)

        this.hasErrorInOperation = !!resultModel.hasErrorInOperation
    }

    static errorOperation<ResultValueModel = any>(errorInfo: ErrorResultInfo, statusCode = 400) {
        return new ResultDatabase<ResultValueModel>({
            ok: false,
            status: statusCode,
            value: null,
            error: new ErrorResult(errorInfo),
            hasErrorInOperation: true,
        })
    }

    static success<ResultValueModel = any>(successInfo: ResultValueModel, statusCode = 200) {
        return new ResultDatabase<ResultValueModel>({ ok: true, status: statusCode, value: successInfo, error: null, hasErrorInOperation: false })
    }

    static failure<ResultValueModel = any>(errorInfo: ErrorResultInfo, statusCode = 400) {
        return new ResultDatabase<ResultValueModel>({ ok: false, status: statusCode, error: new ErrorResult(errorInfo), value: null, hasErrorInOperation: false })
    }

    static inherit<ResultValueModelInherited = any>({ ok, status, value, error }: ResultModel<ResultValueModelInherited>) {
        return new ResultDatabase<ResultValueModelInherited>({ ok, status, error, value, hasErrorInOperation: false })
    }

    getResult() {
        return Result.inherit<ResultValueModel>(this.getResponse())
    }

    isErrorInOperation() {
        return this.hasErrorInOperation
    }
}
