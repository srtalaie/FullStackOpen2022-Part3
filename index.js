const express = require('express')
const app = express()

app.use(express.json())

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
    { 
      "id": 5,
      "name": "t", 
      "number": "39-23-6423122"
    },
    { 
      "id": 6,
      "name": "v", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(person => person.id))
      : 0
    return maxId + 1
  }

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})