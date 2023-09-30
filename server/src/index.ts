import { ApplicationClient } from './services/http/client'
import './services/database/index'

const repository = new ApplicationClient('@db:')

async function App() {
    const response = await repository.get('users')

    console.log(response)
}

App()