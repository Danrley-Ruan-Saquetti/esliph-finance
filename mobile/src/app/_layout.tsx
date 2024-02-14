import { Slot } from 'expo-router'
import { P } from '@expo/html-elements'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as InterFont from '@expo-google-fonts/inter'

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
            {isLoaded ? <Slot /> : <P>Loading...</P>}
        </SafeAreaProvider>
    )
}