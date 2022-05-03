const express = require('express')
const app = express()
const cors = require('cors')

const morgan = require('morgan')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

//Middleware
app.use(cors());
app.options('*', cors());  // enable pre-flight
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let entries = persons.length
    let date = new Date()
    res.send(
        `<p>Phone book has info for ${entries} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).send({ 
      error: 'person info missing' 
    })
  } else if(persons.some(person => person.name === body.name)){
    return res.status(400).send({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: Math.floor(Math.random() * (1000000000000 - 6 + 1) + 6),
    name: body.name,
    number: body.number

  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})