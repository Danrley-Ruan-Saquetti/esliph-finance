import { PropsWithChildren, useContext } from 'react'
import { P } from '@expo/html-elements'
import { AuthenticationContext } from '@contexts/authentication'

export function ValidAuthenticate(props: PropsWithChildren) {
    const { token, isLoad } = useContext(AuthenticationContext)

    if (isLoad) {
        if (!token) {
            return (<><P>Is'nt Authenticate</P></>)
        }
    }

    return (<>{props.children}</>)
}