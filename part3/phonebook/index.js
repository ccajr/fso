require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny', {
  skip: function (req, ) { return req.method === 'POST'}
}))

morgan.token('body', function (req, ) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: function (req, ) { return req.method !== 'POST'}
}))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const html = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `
    response.send(html)
  })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  Person.find({ name: name }).then(duplicatePerson => {
    if (duplicatePerson.length > 0) {
      return response.status(409).json({
        error: 'name must be unique'
      })
    }

    const person = new Person({
      name: name,
      number: number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
      .catch(error => next(error))
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }

    person.name = name
    person.number = number

    person.save()
      .then(updatedPerson => {
        return response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})