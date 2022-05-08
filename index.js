/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')

const app = express()
const cors = require('cors')

const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))

// Middleware
app.use(cors())
app.options('*', cors()) // enable pre-flight
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(morgan(':method :url :body'))

// Routes
app.get('/info', (_req, res, next) => {
  let entries
  const date = new Date()
  Person.find({})
    .then((results) => {
      entries = results.length
      res.send(
        `<p>Phone book has info for ${entries} people</p>
        <p>${date}</p>
    `,
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then((people) => {
      if (people) {
        res.json(people)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.find({ _id: id })
    .then((person) => {
      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findOneAndDelete({ _id: id })
    .then((result) => {
      if (result) {
        res.send(result)
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).send({
      error: 'person info missing',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.create(person)
    .then((results) => {
      if (results) {
        res.send(results)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { body } = req

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then((result) => {
      if (result) {
        res.send(result)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Error Handler
const errorHandler = (error, _req, res, next) => {
  console.error('Error:', error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
