export class BankAccountGenerateCodeUseCase {
    perform() {}

    gerarNumeroContaBancaria() {
        const prefixoBanco = '001'

        const corpoConta = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0')

        const digitoVerificador = this.calcularDigitoVerificador(prefixoBanco + corpoConta)

        const numeroContaBancaria = `${prefixoBanco}-${corpoConta}-${digitoVerificador}`

        return numeroContaBancaria
    }

    calcularDigitoVerificador(numero) {
        const somaDigitos = numero.split('').reduce((soma, digito) => soma + parseInt(digito, 10), 0)

        return somaDigitos % 10
    }
}
