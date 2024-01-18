import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { getDistinctValuesInArray } from '@util'
import { BadRequestException, } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/category.global'
import { CategoryRepository } from '@modules/category/category.repository'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO, GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/financial-transaction.global'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    title: ValidatorService.schema
        .string()
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .max(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.maxCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .optional(),
    description: ValidatorService.schema
        .string()
        .trim()
        .optional(),
    priority: ValidatorService.schema
        .coerce
        .number()
        .nonnegative({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive })
        .optional(),
    isObservable: ValidatorService.schema
        .boolean()
        .optional(),
    isSendNotification: ValidatorService.schema
        .boolean()
        .optional(),
    timesToRepeat: ValidatorService.schema
        .number()
        .optional(),
    typeOccurrence: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }),
        })
        .optional(),
    situation: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_RULES.update.situationsEnableToUpdate.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_RULES.update.situationsEnableToUpdate.messageInvalidSituationToUpdate }),
        })
        .optional(),
    frequency: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid }) })
        .optional(),
    receiver: ValidatorService.schema
        .string()
        .trim()
        .optional(),
    sender: ValidatorService.schema
        .string()
        .trim()
        .optional(),
    expiresIn: ValidatorService.schema
        .coerce
        .date()
        .transform(GLOBAL_DTO.date.transform)
        .optional(),
    dateTimeCompetence: ValidatorService.schema
        .coerce
        .date()
        .transform(GLOBAL_DTO.date.transform)
        .optional(),
    notes: ValidatorService.schema.object({
        create: ValidatorService.schema.array(ValidatorService.schema.object({
            description: ValidatorService.schema
                .string()
                .trim()
                .max(GLOBAL_NOTE_DTO.description.maxCharacters, { message: GLOBAL_NOTE_DTO.description.messageRangeCharacters })
                .optional(),
        }))
            .optional()
            .default([]),
        remove: ValidatorService.schema.array(GLOBAL_CATEGORY_DTO.id)
            .optional()
            .default([]),
    })
        .optional()
        .default({ create: [], remove: [] }),
    category: ValidatorService.schema.object({
        link: ValidatorService.schema.array(GLOBAL_CATEGORY_DTO.id)
            .optional()
            .default([]),
        unlink: ValidatorService.schema.array(GLOBAL_CATEGORY_DTO.id)
            .optional()
            .default([]),
    })
        .optional()
        .default({ link: [], unlink: [] })
        .transform(({ link, unlink }) => {
            link = getDistinctValuesInArray(link)
            unlink = getDistinctValuesInArray(unlink)

            link.map((l, i) => {
                const iU = unlink.findIndex(u => u == l)
                if (iU < 0) { return }

                link.splice(i, 1)
                unlink.splice(iU, 1)
            })

            return { link, unlink }
        })
})

export type FinancialTransactionUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.update' })
export class FinancialTransactionUpdateUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('category.repository') private categoryRepository: CategoryRepository,
    ) {
        super()
    }

    async perform(args: FinancialTransactionUpdateDTOArgs) {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.performUC(args)
            await transaction.commit()
            return result
        } catch (err: any) {
            await transaction.rollback()
            throw err
        }
    }

    private async performUC(args: FinancialTransactionUpdateDTOArgs) {
        const dataDTO = this.validateDTO(args, schemaDTO)

        const financialTransaction = await this.verifyIsExistsFinancialTransaction(dataDTO.id)
        const categoriesCreate = await this.filterCategoriesOfTheBank(dataDTO.category.link, financialTransaction.bankAccountId)
        const categoriesRemove = await this.filterCategoriesOfTheBank(dataDTO.category.unlink, financialTransaction.bankAccountId)
        const dataToUpdate = this.processingData(dataDTO, financialTransaction)
        await this.update({
            data: dataToUpdate,
            categories: {
                create: categoriesCreate.categories,
                delete: categoriesRemove.categories
            },
            notes: {
                create: dataDTO.notes.create.filter(({ description }) => !!description) as any,
                delete: dataDTO.notes.remove || [],
            }
        }, dataDTO.id)

        const categoriesNotFound = [
            ...categoriesRemove.categoriesNotFound,
            ...categoriesCreate.categoriesNotFound,
        ]

        return Result.success({ message: `Financial transaction updated successfully${categoriesNotFound.length ? ', but there are some categories that were not found' : ''}`, categoriesNotFound })
    }

    private async verifyIsExistsFinancialTransaction(id: ID) {
        const financialTransactionResult = await this.transactionRepository.findUnique({ where: { id } })

        if (!financialTransactionResult.isSuccess()) {
            if (financialTransactionResult.isErrorInOperation()) {
                throw new BadRequestException({
                    ...financialTransactionResult.getError(),
                    title: 'Find Financial Transaction',
                })
            }

            throw new BadRequestException({ title: 'Find Financial Transaction', message: 'Financial transaction not found' })
        }

        return financialTransactionResult.getValue()
    }

    private processingData(data: SchemaValidator.output<typeof schemaDTO>, original: FinancialTransactionModel.Model): FinancialTransactionModel.UpdateArgs {
        const isAlreadyLate = !!data.expiresIn && this.dateService.now() < data.expiresIn
        const isProgrammatic =
            (!data.typeOccurrence && original.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC) ||
            data.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC

        const dataTransactions: FinancialTransactionModel.UpdateArgs = {
            title: data.title,
            description: data.description,
            receiver: original.type == FinancialTransactionModel.Type.EXPENSE ? data.receiver : undefined,
            sender: original.type == FinancialTransactionModel.Type.INCOME ? data.sender : undefined,
            dateTimeCompetence: data.dateTimeCompetence,
            expiresIn: data.expiresIn,
            frequency: isProgrammatic ? data.frequency : undefined,
            isObservable: data.isObservable,
            isSendNotification: data.isSendNotification,
            priority: data.priority,
            situation: isAlreadyLate ? FinancialTransactionModel.Situation.CANCELED : data.situation,
            timesToRepeat: isProgrammatic ? data.timesToRepeat : undefined,
            typeOccurrence: data.typeOccurrence,
        }

        return dataTransactions
    }

    private async filterCategoriesOfTheBank(categories: ID[], bankAccountId: ID) {
        if (!categories.length) {
            return { categories: [], categoriesNotFound: [] }
        }

        const financialCategories = await this.categoryRepository.findMany({
            where: {
                bankAccountId,
                id: { in: categories }
            }
        })

        if (!financialCategories.isSuccess()) {
            throw new BadRequestException({ ...financialCategories.getError(), title: 'Query Categories' })
        }

        const categoriesNotFound = categories.filter((categoryId) => !financialCategories.getValue().find(transactionCategory => transactionCategory.id == categoryId))

        return { categories: financialCategories.getValue().map(({ id }) => id), categoriesNotFound }
    }

    private async update({ categories, data, notes }: { data: FinancialTransactionModel.UpdateArgs, categories: { create: ID[], delete: ID[] }, notes: { create: { description: string }[], delete: ID[] } }, id: ID) {
        const updateResult = await this.transactionRepository.update({
            where: { id },
            data: {
                ...data,
                categories: {
                    ...(categories.create.length && {
                        createMany: {
                            data: categories.create.map(categoryId => ({
                                categoryId
                            })),
                            skipDuplicates: true
                        }
                    }),
                    ...(categories.delete.length && {
                        deleteMany: {
                            categoryId: {
                                in: categories.delete
                            }
                        }
                    })
                },
                notes: {
                    ...(notes.create.length && {
                        createMany: {
                            data: notes.create.map(({ description }) => ({
                                description
                            })),
                        }
                    }),
                    ...(notes.delete.length && {
                        deleteMany: {
                            id: {
                                in: notes.delete
                            }
                        }
                    })
                }
            }
        })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...updateResult.getError(),
            title: 'Update Financial Transaction',
        })
    }
}
