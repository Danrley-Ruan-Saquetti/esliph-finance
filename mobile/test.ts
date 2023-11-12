async function hmacSha256(key, message) {
    const keyBuffer = new TextEncoder().encode(key)
    const messageBuffer = new TextEncoder().encode(message)

    if (keyBuffer.length > 64) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', keyBuffer)
        keyBuffer.set(new Uint8Array(hashBuffer))
    }

    const blockSize = 64
    const ipad = 0x36
    const opad = 0x5c

    const oKeyPad = new Uint8Array(blockSize)
    const iKeyPad = new Uint8Array(blockSize)

    for (let i = 0; i < blockSize; i++) {
        oKeyPad[i] = keyBuffer[i] ^ opad
        iKeyPad[i] = keyBuffer[i] ^ ipad
    }

    const concatenatedBuffer = new Uint8Array(blockSize + messageBuffer.length)
    concatenatedBuffer.set(iKeyPad)
    concatenatedBuffer.set(messageBuffer, blockSize)

    const innerHashBuffer = await crypto.subtle.digest('SHA-256', concatenatedBuffer)

    const finalConcatenatedBuffer = new Uint8Array(blockSize + innerHashBuffer.length)
    finalConcatenatedBuffer.set(oKeyPad)
    finalConcatenatedBuffer.set(new Uint8Array(innerHashBuffer), blockSize)

    const finalHashBuffer = await crypto.subtle.digest('SHA-256', finalConcatenatedBuffer)

    // Convert the final hash to a hex string
    const hashArray = Array.from(new Uint8Array(finalHashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

    return hashHex
}

// Example usage:
const key = 'yourSecretKey'
const message = 'Hello, HMAC!'

hmacSha256(key, message).then(result => {
    console.log('HMAC-SHA-256:', result)
})