export function test(name: string, action: () => void, repeat = 1) {
    const times: number[] = []

    for (let i = 0; i < repeat; i++) {
        times.push(measure(() => action()))
    }

    console.log(`+- ${name}`)
    console.log(`| Max: ${max(times)}ms`)
    console.log(`| Avg: ${avg(times)}ms`)
    console.log(`| Min: ${min(times)}ms`)
    console.log(`| Tot: ${total(times)}ms`)
    console.log('+-\n')
}

export function measure(func: () => void) {
    const before = performance.now()
    func()
    const after = performance.now()
    return after - before
}

function min(arr: number[]) {
    if (!arr.length) return 0

    return arr.sort()[0]
}

function avg(arr: number[]) {
    if (!arr.length) return 0

    return total(arr) / arr.length
}

function max(arr: number[]) {
    if (!arr.length) return 0

    return arr.sort()[arr.length - 1]
}

function total(arr: number[]) {
    return arr.reduce((acc, val) => acc + val, 0)
}