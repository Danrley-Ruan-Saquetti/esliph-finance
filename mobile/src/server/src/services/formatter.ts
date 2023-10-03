import { Result } from '@esliph/util-node'
import { z } from 'zod'

export class ZodValidateService {
    static performParse<ZodSchema extends z.Schema>(data: z.input<ZodSchema>, schema: ZodSchema): Result<z.output<ZodSchema>> {
        try {
            const resParse = schema.parse(data)

            return Result.success<z.output<ZodSchema>>(resParse)
        } catch (err: any) {
            const resultError = ZodValidateService.getPerformError(err)

            throw Result.failure(resultError.getError())
        }
    }

    private static getPerformError<ZodSchema extends z.Schema>(err: any) {
        if (err instanceof z.ZodError) {
            return ZodValidateService.getPerformErrorIfInstanceofZodError(err)
        }

        return Result.failure<z.output<ZodSchema>>({
            title: 'Formatação e Validação de Dados',
            message: 'Dados inválidos',
            causes: [{ message: err, origin: 'FormatData' }],
        })
    }

    private static getPerformErrorIfInstanceofZodError<ZodSchema extends z.Schema>(err: z.ZodError) {
        const dataErrors = err.errors.map(_err => {
            return { message: _err.message, origin: _err.path.join(';') }
        })

        return Result.failure<z.output<ZodSchema>>({ title: 'Formatação e Validação de Dados', message: 'Dados inválidos', causes: dataErrors })
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
