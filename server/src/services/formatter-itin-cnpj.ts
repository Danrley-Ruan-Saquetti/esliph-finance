import { extractDigits } from '@util/geral'
import { PeopleModel } from '@modules/people/model'

export class FormatterItinCnpj {
    static formatItinCnpj(itinCnpj: string) {
        return itinCnpj.length == 11 ? FormatterItinCnpj.formatItin(itinCnpj) : FormatterItinCnpj.formatCnpj(itinCnpj)
    }

    static formatItin(itin: string) {
        return itin.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
    }

    static formatCnpj(cnpj: string) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    }

    static getTypePerson(itinCnpj: string): PeopleModel.Type | null {
        if (FormatterItinCnpj.validFormatItin(itinCnpj) || (!isNaN(+itinCnpj) && itinCnpj.length == 11)) {
            if (!FormatterItinCnpj.validItin(extractDigits(itinCnpj))) return null

            return PeopleModel.Type.NATURAL_PERSON
        }
        if (FormatterItinCnpj.validFormatCnpj(itinCnpj) || (!isNaN(+itinCnpj) && itinCnpj.length == 14)) {
            if (!FormatterItinCnpj.validCnpj(extractDigits(itinCnpj))) return null

            return PeopleModel.Type.LEGAL_ENTITY
        }

        return null
    }

    static validFormatItin(itin: string) {
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(itin)
    }

    static validFormatCnpj(cnpj: string) {
        return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj)
    }

    static validItin(itin: string) {
        if (!itin) return false

        itin = extractDigits(itin)

        if (/[^\d]+/g.test(itin)) return true

        if (itin.length !== 11 || !!itin.match(/(\d)\1{10}/)) return false

        const digitsItin = itin.split('').map(el => +el)

        const rest = (count: number) => (digitsItin.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10

        return rest(10) === digitsItin[9] && rest(11) === digitsItin[10]
    }

    static validCnpj(cnpj: string) {
        if (!cnpj) return false

        cnpj = extractDigits(cnpj)

        if (cnpj.length !== 14) return false

        let isSameDigits = true
        for (let i = 1; cnpj.length; i++)
            if (cnpj[0] != cnpj[i]) {
                isSameDigits = false
                break
            }

        if (isSameDigits) return false

        let size: number = cnpj.length - 2
        let numbers: string = cnpj.substring(0, size)
        let digits: string = cnpj.substring(size)
        let sum: number = 0
        let pos: number = size - 7

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--
            if (pos < 2) pos = 9
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
        if (result !== parseInt(digits.charAt(0))) return false

        size = size + 1
        numbers = cnpj.substring(0, size)
        sum = 0
        pos = size - 7

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--
            if (pos < 2) pos = 9
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
        if (result !== parseInt(digits.charAt(1))) return false

        return true
    }
}
