import { z } from 'zod'
import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import { ResultException } from '@common/exceptions'
export * as SchemaValidator from 'zod'

@Service({ name: 'global.service.validator' })
export class ValidatorService {
    static schema = z

    performParse<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        try {
            const parseResponse = schema.parse(data)

            return Result.success<z.output<ZodSchema>>(parseResponse)
        } catch (err: any) {
            const resultError = this.getPerformError(err)

            throw new ResultException(resultError.getError())
        }
    }

    private getPerformError<ZodSchema extends z.Schema>(err: any) {
        if (err instanceof z.ZodError) {
            return this.getPerformErrorIfInstanceofZodError(err)
        }

        return Result.failure<z.output<ZodSchema>>({
            title: 'Validate Data',
            message: 'Failed to validate data',
            causes: [{ message: err, origin: 'FormatData' }],
        })
    }

    private getPerformErrorIfInstanceofZodError<ZodSchema extends z.Schema>(err: z.ZodError) {
        const dataErrors = err.errors.map(_err => {
            return { message: _err.message, origin: _err.path.join(';') }
        })

        return Result.failure<z.output<ZodSchema>>({ title: 'Validate Data', message: 'Data invalid', causes: dataErrors })
    }

    public static defaultSchemaModelTable() {
        const objectDefault = z.object({
            id: z
                .union([z.string(), z.number()])
                .refine(value => !isNaN(Number(value)))
                .transform(value => Number(value)),
        })

        return objectDefault
    }
}
