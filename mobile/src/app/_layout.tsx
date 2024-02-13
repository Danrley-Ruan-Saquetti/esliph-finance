import { Slot } from 'expo-router'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts
} from '@expo-google-fonts/inter'
import { Loading } from '@components/loading'

export default function Layout() {
    const [isLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    })

    if (!isLoaded) {
        return <Loading />
    }

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaProvider className={`pt-{${insets.top}}`}>
            <Slot />
        </SafeAreaProvider>
    )
}