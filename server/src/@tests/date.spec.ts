import { DateTime } from 'luxon'

console.log(DateTime.now().setZone('America/Sao_Paulo').toISO())