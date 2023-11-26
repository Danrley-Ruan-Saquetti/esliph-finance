import { View, Text, Button } from 'react-native'
import { useEffect, useState } from 'react'
import { Bootstrap } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { MainModule } from '@server/main.module'
import { DatabaseService } from '@server/services/database'

Injection.Clear()
Bootstrap(MainModule, { logLoad: true, logEventHttp: true, logEventListener: true })

export default function App() {
    const [text, setText] = useState('')

    const setup = async () => {
        const database = Injection.resolve(DatabaseService)

        await database.createTable('test', ['id INTEGER PRIMARY KEY AUTOINCREMENT', 'text TEXT'], { ignoreIfAlreadyExists: true })

        await query()
    }

    const create = async () => {
        const database = Injection.resolve(DatabaseService)

        const result = await database.exec('INSERT INTO test (text) VALUES (?)', ['Hello World'])

        if (result.isSuccess()) {
            await query()
        } else {
            console.log(result)
        }
    }

    const query = async () => {
        const database = Injection.resolve(DatabaseService)

        const result = await database.query('SELECT * FROM test')

        setText(result.getValue())
    }

    useEffect(() => {
        setup()
    }, [])

    return (
        <>
            <View className="flex-1 items-center justify-center bg-white">
                <Button title="create" onPress={() => create()}>
                    Create
                </Button>
                <Text>{JSON.stringify(text)}</Text>
            </View>
        </>
    )
}
