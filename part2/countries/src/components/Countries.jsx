const Countries = ({ countriesToShow, isTooMany, handleShow }) => {
  if (isTooMany) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (countriesToShow === null) {
    return null
  }

  return (
    <div>
      {countriesToShow.map(name => 
        <div key={name}>
            {name} <button value={name} onClick={handleShow}>Show</button>
        </div>
      )}
    </div>
  )
}

export default Countries