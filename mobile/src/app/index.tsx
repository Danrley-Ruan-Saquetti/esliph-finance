import { Text, View } from 'react-native'
import { Bootstrap } from '@esliph/module'
import { MainModule } from '@server/main.module'

Bootstrap(MainModule, { logLoad: true, logEventHttp: true, logEventListener: true })

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World</Text>
        </View>
    )
}
