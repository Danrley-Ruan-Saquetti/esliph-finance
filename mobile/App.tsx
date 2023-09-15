import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

export default function App() {
    return (
        <View className="bg-gray-600 flex-1 justify-center items-center">
            <Text className="text-zinc-50 text-xl">Teste!</Text>
            <StatusBar />
        </View>
    )
}

