export class MonetaryValue {
    static toCents(value: number) {
        return Math.round(value * 100)
    }

    static toReal(value: number) {
        return value / 100
    }

    static toFixed(value: number) {
        return Number(value.toFixed(2))
    }
}