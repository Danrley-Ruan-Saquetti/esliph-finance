import { z } from 'zod'
import { Result } from '@esliph/common'
import { Json } from '@util/json'
import { BadRequestException } from '@exceptions/bad-request'
export * as z from 'zod'

export class Validator {

    parse<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        return Validator.parse(data, schema)
    }

    parseFilter<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        return Validator.parseFilter(data, schema)
    }

    static parseNoSafe<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): z.output<ZodSchema> {
        const result = Validator.parse(data, schema)

        if (!result.isSuccess())
            throw new BadRequestException(result.getError())

        return result.getValue()
    }

    static parseFilterNoSafe<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): z.output<ZodSchema> {
        const result = Validator.parseFilter(data, schema)

        if (!result.isSuccess())
            throw new BadRequestException(result.getError())

        return result.getValue()
    }

    static parseFilter<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        for (const arg in data) {
            const valueResult = Json.parseSafe(data[arg])

            if (!valueResult.isSuccess()) {
                continue
            }

            data[arg] = valueResult.getValue()
        }

        return Validator.parse(data, schema)
    }

    static parse<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        try {
            const parseResponse = schema.parse(data)

            return Result.success<z.output<ZodSchema>>(parseResponse)
        } catch (err: any) {
            return this.getError<z.output<ZodSchema>>(err)
        }
    }

    private static getError<ZodSchema extends z.Schema>(err: any) {
        if (err instanceof z.ZodError) {
            return this.getZodError(err)
        }

        return this.getDefaultErrorMessage<ZodSchema>(err)
    }

    private static getZodError<ZodSchema extends z.Schema>(err: z.ZodError) {
        const dataErrors = err.errors.map(_err => {
            return { message: _err.message, origin: _err.path.join('.') }
        })

        return Result.failure<z.output<ZodSchema>>({ title: 'Validate Data', message: 'Data invalid', causes: dataErrors })
    }

    private static getDefaultErrorMessage<ZodSchema extends z.Schema>(err: any) {
        return Result.failure<z.output<ZodSchema>>({
            title: 'Validate Data',
            message: 'Failed to validate data',
            causes: [{ message: err, origin: 'FormatData' }],
        })
    }
}
