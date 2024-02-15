import { createContext, PropsWithChildren, useState } from 'react'
import { useStorage } from '@hooks/use-storage'
import { GLOBAL_KEYS } from '@global'

export type SessionCustomerContextType = any

export const SessionCustomerContext = createContext<SessionCustomerContextType>({})

export function SessionCustomerProvider(props: PropsWithChildren) {
    const { valueState: token, setItem: setToken, isLoading } = useStorage<string>(GLOBAL_KEYS.TOKEN_CUSTOMER, null)

    return (
        <SessionCustomerContext.Provider value={{
            isLoading
        }}>
            {props.children}
        </SessionCustomerContext.Provider>
    )
}