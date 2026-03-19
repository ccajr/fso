const mongoose = require('mongoose')

let showAll = false

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
let name = null
let number = null

if (process.argv.length === 3) {
    showAll = true
} else if (process.argv.length === 5) {
    name = process.argv[3]
    number = process.argv[4]
} else {
    console.log('provide both name and number as arguments')
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@cluster0.1oco2mb.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (showAll) {
    Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}