import { P } from '@expo/html-elements'
import { AuthenticationService } from '@services/authentication.service'
import { useEffect } from 'react'

const authentication = new AuthenticationService()

export default function Home() {

    const isLogged = async () => {
        const result = await authentication.getTokenCustomer()

        console.log(result)
    }

    useEffect(() => {
        isLogged()
    }, [])

    return (
        <><P>Hello World</P></>
    )
}