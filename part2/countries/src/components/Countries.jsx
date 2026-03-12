const Countries = ({ countriesToShow, isTooMany }) => {
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
        <div key={name}>{name}</div>
      )}
    </div>
  )
}

export default Countries