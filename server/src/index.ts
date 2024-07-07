console.log('----------------------------------------------------------------------------------------------------------')
import { APP } from '@app'
import { MainModule } from '@main.module'

process.on('exit', () => {
    console.log('Exit application...')
})

await APP.Bootstrap(MainModule)