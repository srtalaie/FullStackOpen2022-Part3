require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const morgan = require('morgan')
const req = require('express/lib/request')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

//Middleware
app.use(cors());
app.options('*', cors());  // enable pre-flight
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(morgan(':method :url :body'))

//Routes
app.get('/info', (req, res) => {
  let entries
  let date = new Date()
  Person.find({})
    .then(results => {
      entries = results.length
      res.send(
        `<p>Phone book has info for ${entries} people</p>
        <p>${date}</p>
    `)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(people => {
        res.json(people)
      })
      .catch(err => err.message)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person.find({ _id: id })
      .then(person => {
        res.send(person)
      })
      .catch(err => {
        console.log(err)
        res.status(404).end()
      })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findOneAndDelete({ _id: id })
      .then(result => {
        res.send(result)
        res.status(204).end()
      })
      .catch(err => {
        console.log(err)
        res.status(404).end()
      })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).send({ 
      error: 'person info missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number

  }

  Person.create(person)
    .then(results => {
      res.send(results)
    })
    .catch(err => {
      console.log(err)
      res.status(404).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})