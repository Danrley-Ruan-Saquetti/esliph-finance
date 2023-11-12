import { Text, View } from 'react-native'
import { Bootstrap } from '@server/index'

Bootstrap()

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World</Text>
        </View>
    )
}
