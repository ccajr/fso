require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === 'POST'}
}))

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (req, res) { return req.method !== 'POST'}
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
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
        .then(result => {
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

app.post('/api/persons', (request, response) => {
    const body = request.body
    const missing = []

    if (!body.name) {
        missing.push('name')
    }
    if (!body.number) {
        missing.push('number')
    }

    if (missing.length > 0) {
        return response.status(400).json({
            error: `Missing required fields: ${missing.join(", ")}`
        })
    }

    Person.find({ name: body.name }).then(duplicatePerson => {
        if (duplicatePerson.length > 0) {
            return response.status(409).json({
                error: 'name must be unique'
            })
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const missing = []

    if (!body.name) {
        missing.push('name')
    }
    if (!body.number) {
        missing.push('number')
    }

    if (missing.length > 0) {
        return response.status(400).json({
            error: `Missing required fields: ${missing.join(", ")}`
        })
    }

    Person.findById(request.params.id).then(person => {
        if (!person) {
            return response.status(404).end()
        }

        person.name = body.name
        person.number = body.number

        person.save().then(updatedPerson => {
            return response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})