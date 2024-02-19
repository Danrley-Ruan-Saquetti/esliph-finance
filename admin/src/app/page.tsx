'use client'

import { useEffect } from 'react'
import { ApiService } from '../services/api.service'

export default function Home() {

    const foo = async () => {
        const api = new ApiService()
        const result = await api.get('http://localhost:8080/v1/status')

        console.log(result)
    }

    useEffect(() => {
        foo()
    }, [])

    return (
        <></>
    )
}
