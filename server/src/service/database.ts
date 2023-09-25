import sqlite3 from 'sqlite3'
import { getEnv } from '@esliph/util-node'

export const db = new sqlite3.Database(getEnv({ name: 'DATABASE_URL', defaultValue: './storage/databse.db' }), err => {
    err && console.log(err)
})

// db.run('DROP TABLE account')

db.run(
    `CREATE TABLE IF NOT EXISTS account (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
login TEXT,
password TEXT,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
    err => {
        err && console.log(err)
    },
)

// db.run('INSERT INTO account (name, login, password) VALUES (?, ?, ?)', ['Dan', 'dan.ruan@gmail.com', '1234'], err => {
//     err && console.log(err)
// })

db.all('SELECT * FROM account', [], (err, rows) => {
    if (err) {
        return console.log(err)
    }
    rows.forEach((row: any) => {
        console.log(row)
    })
})
