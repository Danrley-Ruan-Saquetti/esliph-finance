import { Text, View } from 'react-native'
import { Bootstrap } from '@esliph/module'
import { MainModule } from '@server/main.module'
import { Injection } from '@esliph/injection'
import { JWTService } from '../server/services/jwt.service'

Injection.Clear()
Bootstrap(MainModule, { logLoad: true, logEventHttp: true, logEventListener: true })

async function Boot() {
    const jwtService = Injection.resolve(JWTService)

    const secret = 'meu-segredo'
    const payload = {
        sub: 1,
    }

    const token = await jwtService.encode(payload, { secret, exp: 60 * 60 * 24 })

    console.log(token)

    const decode = await jwtService.decode(token, secret)

    console.log(decode)
}

Boot()

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Hello World</Text>
        </View>
    )
}
