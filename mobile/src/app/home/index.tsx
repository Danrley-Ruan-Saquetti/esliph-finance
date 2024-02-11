import { View, Text } from 'react-native'
import { storageService } from '../../services/storage.service'

export default function Home() {
    const logout = async () => {
        await storageService.delete('token')
    }

    return (
        <>
            <View className='top-10'>
                <Text className='text-pink-50' onPress={() => logout()}>'Hello World - Logout</Text>
            </View>
        </>
    )
}