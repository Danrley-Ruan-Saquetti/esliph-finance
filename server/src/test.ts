import { Database, Transaction } from '@services/database'
import { PeopleModel } from '@modules/people/model'

TestModel()

async function TestModel() {
    const { peopleRepository } = PeopleModel
}

async function TestTransaction() {
    const transaction = new Transaction()

    const database = Database.instance.instance

    await transaction.begin()
    let savePoint = await transaction.save()

    await database.$transaction([
        database.people.updateMany({
            data: { name: 'Dan Ruan' },
            where: { id: 1 }
        }),
        database.people.updateMany({
            data: { name: 'Dan Ruan' },
            where: { id: 1 }
        }),
    ])

    await savePoint.rollback()
    await transaction.commit()
}