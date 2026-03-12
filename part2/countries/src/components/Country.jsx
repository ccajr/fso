const Country = ({ details }) => {
  if (details === null) {
    return null
  }

  return (
    <div>
      <h1>{details.name.common}</h1>
      <div>Capital {details.capital !== undefined ? details.capital.join(', ') : details.capital}</div>
      <div>Area {details.area}</div>

      <h2>Languages</h2>
      <ul>
        {Object.keys(details.languages).map(key => 
          <li key={key}>{details.languages[key]}</li>
        )}
      </ul>
      <img
        src={details.flags.png ? details.flags.png : details.flags.svg} 
        alt={details.flags.alt}
      />
    </div>
  )
}

export default Country