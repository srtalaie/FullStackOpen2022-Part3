/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://phonebookadmin:${password}@cluster0.5gmya.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  newPerson.save().then((_result) => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to the phonebook`)
    mongoose.connection.close()
  })
}
