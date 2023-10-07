import { ListenerPublicClient } from '../services/http'

export function GenerateListenerClient() {
    const listenerClient = new ListenerPublicClient({ origin: 'Test' })

    return listenerClient
}