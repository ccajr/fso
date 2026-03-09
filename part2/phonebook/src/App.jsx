import { useState } from 'react'

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
      number: newNumber
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
      <div>
        filter shown with<input name='filter' value={newFilter} onChange={handleChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input name='name' value={newName} onChange={handleChange} />
        </div>
        <div>
          number: <input name='number' value={newNumber} onChange={handleChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {personsToShow.map(person => 
          <div key={person.name}>{person.name} {person.number}</div>
        )}
    </div>
  )
}

export default App