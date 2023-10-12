import { ListenerPublicClient } from '../services/http'

export function GenerateListenerClient() {
    const listenerClient = new ListenerPublicClient()

    listenerClient.use({ origin: 'Test' })

    return listenerClient
}