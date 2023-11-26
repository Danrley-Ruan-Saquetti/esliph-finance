import { View } from 'react-native'
import { Bootstrap } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { MainModule } from '@server/main.module'

Injection.Clear()
Bootstrap(MainModule, { logLoad: true, logEventHttp: true, logEventListener: true })

export default function App() {
    return <View className="flex-1 items-center justify-center bg-white"></View>
}
