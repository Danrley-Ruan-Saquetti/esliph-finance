import { Text, View } from 'react-native'
import { hello } from '@server/app'

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World {hello}</Text>
        </View>
    )
}

