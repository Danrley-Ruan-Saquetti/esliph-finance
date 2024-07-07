import { z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { ENV } from '@env'
import { isArray } from '@util/types'
import { toCapitalise } from '@util/geral'

export namespace DTO {
    export const required = (value: string) => `${toCapitalise(value)} is required`

    export const text = {
        transformOptional: (val?: string | null) => val ? val.replace(/ {2,}/g, ' ') : undefined,
        transform: (val: string) => val.replace(/ {2,}/g, ' '),
    }

    const dateTransform = (date: Date) => {
        return date
    }

    const dateTransformOptional = (date?: Date | null) => {
        return date ? date : undefined
    }

    export const GLOBAL_SERVER_JWT_TOKEN = {
        keyCustomer: ENV.SERVER_JWT_TOKEN_KEY_CUSTOMER,
        keyMaster: ENV.SERVER_JWT_TOKEN_KEY_MASTER,
        keyBankAccount: ENV.SERVER_JWT_TOKEN_KEY_BANK,
        keyResetPassword: ENV.SERVER_JWT_TOKEN_KEY_RESET_PASSWORD,
        authenticationExpiresTime: ENV.SERVER_JWT_TOKEN_AUTHENTICATION_EXPIRES_TIME,
        resetPasswordExpiresTime: ENV.SERVER_JWT_TOKEN_RESET_PASSWORD_EXPIRES_TIME,
    }

    export const date = {
        schema: z
            .coerce
            .date({ 'invalid_type_error': 'Date format invalid' })
            .transform(dateTransform),
        transform: dateTransform,
        transformOptional: dateTransformOptional,
    }

    const colorRegex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
    const colorRegexMessageInvalid = 'Color hexadecimal is invalid'
    const colorTransform = (color: string) => color.toUpperCase()

    export const color = {
        regex: colorRegex,
        messageRegex: 'Invalid color hexadecimal',
        transform: colorTransform,
        schema: z
            .string({ 'invalid_type_error': 'Color invalid' })
            .trim()
            .max(45, { message: 'The Color must have a maximum of 45 characters' })
            .regex(colorRegex, { message: colorRegexMessageInvalid })
            .transform(colorTransform),
    }

    export const number = {
        messageInvalidType: (value: string) => `${toCapitalise(value)} must be a number`,
        transform: (val: number) => Number(val),
        transformOptional: (val?: number | null) => Number(val) || undefined,
    }

    export const monetaryValue = {
        schema: () => z
            .coerce
            .number()
            .transform(MonetaryValue.toFixed)
    }

    export const id = {
        schema: ({ name }: { name: string }) =>
            z.coerce
                .number({ 'required_error': required(`ID ${name}`), 'invalid_type_error': `Type ID ${name} must be a number` })
                .int({ message: 'ID cannot be decimal' })
                .positive({ message: `Invalid ID ${toCapitalise(name)}` }),
        arraySchema: ({ name }: { name: string }) => z.array(id.schema({ name }))
            .default([])
    }

    export const relationEntities = {
        schema: ({ name }: { name: string }) =>
            z.object({
                link: id.arraySchema({ name }),
                unlink: id.arraySchema({ name }),
            })
                .transform(({ link, unlink }) => {
                    if (!link.length || !unlink.length) return { link, unlink }

                    for (let i = 0; i < unlink.length; i++) {
                        const index = link.findIndex(category => unlink[i] == category)

                        if (index < 0) continue

                        link = link.slice(index, 0)
                    }

                    return { link, unlink }
                })
                .default({})
    }

    const queryPaginationSchema = {
        pageIndex: () => z
            .coerce
            .number({ 'required_error': required('Page Index'), 'invalid_type_error': 'Type Page Index must be a number' })
            .int({ message: 'Page index cannot be decimal' })
            .min(1, { message: 'Page index must be biggest than 1' })
            .default(1)
            .transform(page => page - 1),
        limite: () => z
            .coerce
            .number({ 'required_error': required('Limite of the Registers'), 'invalid_type_error': 'Type Limite of the registers must be a number' })
            .int({
                message: 'Record limit cannot be decimal'
            })
            .min(0, { message: 'The limit of the registers must be biggest than 0' })
            .max(query.limitePerPage, { message: `The limit of the registers must be less than ${query.limitePerPage}` })
            .default(10),
        orderBy: (orders: string[] = []) => {
            const schemaOrderByObject = {}

            orders.forEach(key => {
                schemaOrderByObject[key] = z
                    .enum(
                        ['asc', 'desc'],
                        { errorMap: () => ({ message: `Invalid enum to param "orderBy.${key}". Expect "asc, desc"` }) }
                    )
                    .optional()
            })

            return z
                .union([
                    z.object(schemaOrderByObject),
                    z.array(z.object(schemaOrderByObject)),
                ])
                .default([])
                .transform(val => isArray(val) ? [...val] : [val])
        }
    }

    export const query = {
        limitePerPage: 100,
        pagination: queryPaginationSchema,
        schema: ({ orders = [] }: { orders?: string[], defaultOrder?: string[] } = {}) => z.object({
            pageIndex: queryPaginationSchema.pageIndex(),
            limite: queryPaginationSchema.limite(),
            orderBy: queryPaginationSchema.orderBy(orders),
        })
    }

    export function createSlug(text: string) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/-+/g, '-')
    }

    export function isValidSlug(slug: string) {
        return /^[a-z0-9]+([_-][a-z0-9]+)*$/.test(slug)
    }
}