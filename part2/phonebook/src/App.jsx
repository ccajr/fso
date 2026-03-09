import { useState } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.length === 0 || newNumber.length === 0) {
      alert("Name and number are required")
      return
    }

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }))
    setNewName('')
    setNewNumber('')
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
      <Filter name='filter' value={newFilter} onChange={handleChange} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        onChange={handleChange}
        newName={newName}
        newNumber={newNumber}
        />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App