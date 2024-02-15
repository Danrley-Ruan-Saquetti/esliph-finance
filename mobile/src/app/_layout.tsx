import { Slot } from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import InterFont from '@expo-google-fonts/inter'
import { Loading } from '@components/loading'

export default function Layout() {
    const [isLoaded] = InterFont.useFonts({
        'Inter_400Regular': InterFont['Inter_400Regular'],
        'Inter_500Medium': InterFont['Inter_500Medium'],
        'Inter_600SemiBold': InterFont['Inter_600SemiBold'],
        'Inter_700Bold': InterFont['Inter_700Bold'],
    })

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaProvider className={`pt-{${insets.top}}`}>
            {isLoaded ? <Slot /> : <Loading />}
        </SafeAreaProvider>
    )
}