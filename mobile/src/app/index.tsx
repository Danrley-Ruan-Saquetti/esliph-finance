import { Link } from 'expo-router'
import { View, Text } from 'react-native'

export default function Home() {

    return (
        <>
            <View className='top-10'>
                <Text className='text-pink-50'>Hello World</Text>

                <Link href={'/auth/sign-in/'}>Login</Link>
            </View>
        </>
    )
}