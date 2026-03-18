const Persons = ({ personsToShow, onDelete }) => (
    <div>
        {personsToShow.map(person => 
            <div key={person.id}>
                {person.name} {person.number} <button onClick={(e) => onDelete(person.id, person.name)}>delete</button>
            </div>
        )}
    </div>
)

export default Persons