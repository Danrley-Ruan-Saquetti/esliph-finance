import { createContext, PropsWithChildren, useState } from 'react'
import { useStorage } from '@hooks/use-storage'
import { GLOBAL_KEYS } from '@global'
import { Result } from '@lib/common'

export type AuthenticationContextType = {
    isLoad: boolean
    token: string
    setToken: (value: string) => Promise<Result<{
        message: string;
    }>>
}

export const AuthenticationContext = createContext<AuthenticationContextType>({ isLoad: false, token: '', setToken: async () => { return null as any } })

export function AuthenticationProvider(props: PropsWithChildren) {
    const { valueState: token, setItem: setToken, isLoading: isLoad, remove } = useStorage<string>(GLOBAL_KEYS.TOKEN_CUSTOMER, null)

    return (
        <AuthenticationContext.Provider value={{
            isLoad,
            token,
            setToken
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}