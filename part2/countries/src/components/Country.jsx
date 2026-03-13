import Weather from "./Weather"

const Country = ({ details, weather }) => {
  if (details === null) {
    return null
  }

  return (
    <div>
      <h1>{details.name.common}</h1>
      <div>Capital {details.capital.join(', ')}</div>
      <div>Area {details.area.toLocaleString('en-US')} km²</div>
      <div>Timezones {details.timezones.join(', ')}</div>

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

      <Weather details={weather} />
    </div>
  )
}

export default Country