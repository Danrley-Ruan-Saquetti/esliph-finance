'use server'

import { cookies } from 'next/headers'

export type CookieOptions = {
    expiresIn: Date
}

export async function create(name: string, value: any, options: Partial<CookieOptions> = {}) {
    cookies().set({
        name,
        value: typeof value == 'string' ? value : JSON.stringify(value),
        expires: options.expiresIn,
        path: '/'
    })
}