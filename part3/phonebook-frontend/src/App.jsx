import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialData => {
      setPersons(initialData)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.length === 0 || newNumber.length === 0) {
      alert("Name and number are required")
      return
    }

    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = {
          ...person, number: newNumber
        }

        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
              setPersons(persons.map(p => p.name === newName ? returnedPerson : p))
              setNewName('')
              setNewNumber('')
              displayNotification(`Updated ${returnedPerson.name}'s number`, false)
            })
          .catch(error => {
            displayNotification(`Information of ${newName} has already been removed from server`, true)
            setPersons(persons.filter(p => p.name !== newName))
          })
      }

      return
    }
    
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        displayNotification(`Added ${returnedPerson.name}`, false)
      })
      .catch(error => displayNotification(error.response.data.error, true))
  }

  const deletePerson= (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
      personService.remove(id)
      .then((response) => {
        setPersons(persons.filter(p => p.id !== id))
        displayNotification(`Deleted ${name}`, false)
      })
    }
  }

  const displayNotification = (message, isError) => {
    setNewMessage({
      content: message,
      isError: isError
    })

    setTimeout(() => {
      setNewMessage(null)
    }, 5000)
  }

  const handleChange = (event) => {
    switch(event.target.name) {
      case 'name': 
        setNewName(event.target.value)
        break
      case 'number':
        setNewNumber(event.target.value)
        break
      case 'filter':
        setNewFilter(event.target.value)
        break
    }
  }

  const lowerFilter = newFilter.toLowerCase();
  const personsToShow = newFilter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(lowerFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} />
      <Filter name='filter' value={newFilter} onChange={handleChange} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        onChange={handleChange}
        newName={newName}
        newNumber={newNumber}
        />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App