import { Text, View } from 'react-native'
import Bootstrap from '@server/core/bootstrap'
import { GenerateLogin } from '@server/@tests/login'
import { GenerateListenerClient } from '@server/@tests/listener-client-public'
import { useEffect } from 'react'

export default function App() {
    const bootstrap = async () => {
        Bootstrap()

        const listener = GenerateListenerClient()
        await GenerateLogin(listener)

        await listener.post('PU:categories/create', { name: 'Category 1' })
    }

    useEffect(() => {
        bootstrap()
    }, [])

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World</Text>
        </View>
    )
}
