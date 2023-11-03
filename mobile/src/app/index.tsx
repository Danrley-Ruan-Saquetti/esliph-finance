import { Text, View } from 'react-native'
import Bootstrap from '../server/core/bootstrap'
import { useEffect } from 'react'

// Bootstrap()

export default function App() {
    const bootstrap = () => {}

    useEffect(() => {
        bootstrap()
    }, [])

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World</Text>
        </View>
    )
}
