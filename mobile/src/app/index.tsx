import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { storageService } from '@services/storage.service'
import { APIPortal } from '@repositories/portal-finance-api.repository'

const credentials = {
    'login': 'danrsaquetti@gmail.com',
    'password': 'Ab12345'
}

export default function Home() {
    const router = useRouter()

    const validIsLogged = async () => {
        const tokenResult = await storageService.get('token')

        if (!tokenResult.isSuccess()) {
            return false
        }

        const result = await APIPortal.get<{ token: string }>(`/client/auth/customer/sign-in/valid-token?token=${tokenResult.getValue()}`)

        return result.isSuccess()
    }

    const validToken = async () => {
        const isLogged = await validIsLogged()

        if (isLogged) {
            router.navigate('/home/')
        } else {
            router.navigate('/auth/sign-in/')
        }
    }

    useEffect(() => {
        validToken()
    }, [])

    return (
        <></>
    )
}